import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse";

import {
    findUserByEmail,
    createUser,
} from "./auth.service";

import { HttpStatus } from "../../utils/httpStatus";
import { BadRequestException } from "../../utils/exception";

/*
   REGISTER
*/
export async function register(req: Request) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        throw new BadRequestException('Name, email and password are required', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) throw new BadRequestException('User already exists', HttpStatus.CONFLICT);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        name,
        email,
        password: hashedPassword,
        role: "customer",
    });

    return successResponse(
        "User registered successfully",
        null,
        201
    );
}

/*
   LOGIN
*/
export async function login(
    req: Request,
    res: Response
) {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error(
            "Email and password are required"
        );
    }

    const user =
        await findUserByEmail(email);

    if (!user) {
        throw new Error(
            "Invalid credentials"
        );
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new Error(
            "Invalid credentials"
        );
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h",
        }
    );

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } =
        user;

    return successResponse(
        "Login successful",
        {
            user: safeUser,
        }
    );

}