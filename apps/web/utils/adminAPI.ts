// apps/web/utils/adminAPI.ts
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/utils/database";
import { JwtPayload } from "jsonwebtoken";

export async function verifyAdminToken(req: NextRequest): Promise<JwtPayload | null> {
    try {
        // Convert NextRequest to a plain Request object
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.isAdmin) {
            return null;
        }
        return token as JwtPayload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function initializeDatabase() {
    try {
        await dbConnect();
    } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Database connection failed");
    }
}