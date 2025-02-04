// apps/web/app/api/admin/user/retrieve-all/route.ts

export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { verifyAdminToken, initializeDatabase } from "@/utils/adminAPI";

export async function GET(request: NextRequest) {
    const token = await verifyAdminToken(request);

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    try {
        await initializeDatabase();
        const users = await User.find({}).select("-password").lean();
        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error retrieving users: ${error.message}` }, { status: 500 });
    }
}