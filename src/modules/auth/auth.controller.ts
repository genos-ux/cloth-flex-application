import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request } from "express";

import { successResponse } from "../../utils/apiResponse";

import {
    findUserByEmail,
    createUser,
} from "./auth.service";

/*
   REGISTER
*/
export async function register(req: Request) {
    const { name, email, password } = req.body;

    /*
       Validate input (basic)
    */
    if (!name || !email || !password) {
        throw new Error(
            "Name, email and password are required"
        );
    }

    /*
       Check existing user
    */
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error(
            "User already exists"
        );
    }

    /*
       Hash password
    */
    const hashedPassword =
        await bcrypt.hash(password, 10);

    /*
       Create user
    */
    // const user = await createUser({
    //         name,
    //         email,
    //         password: hashedPassword,
    //         role: "customer",
    //     });

    return successResponse(
        "User registered successfully",
        null,
        201
    );
}

/*
   LOGIN
*/
export async function login(req: Request) {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error(
            "Email and password are required"
        );
    }

    /*
       Find user
    */
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error(
            "Invalid credentials"
        );
    }

    /*
       Compare password
    */
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

    /*
       Generate JWT
    */
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

    return successResponse(
        "Login successful",
        {
            token,
            user,
        }
    );
}