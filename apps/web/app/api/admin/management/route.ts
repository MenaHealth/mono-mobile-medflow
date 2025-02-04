// apps/web/app/api/admin/management/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, initializeDatabase } from "@/utils/adminAPI";
import Admin from "@/models/admin";
import User from "@/models/user";
import { sendApprovalEmail } from "@/utils/emails/user-approval";

export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const { userId } = await request.json();
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const existingAdmin = await Admin.findOne({ userId: user._id });
        if (existingAdmin) {
            return NextResponse.json({ message: "User is already an admin" }, { status: 400 });
        }

        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
        await newAdmin.save();

        return NextResponse.json({ message: "User added as admin successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ message: "Failed to add user as admin" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const admins = await Admin.find().populate("userId", "firstName lastName email");
        if (!admins || admins.length === 0) {
            return NextResponse.json({ message: "No admins found" }, { status: 404 });
        }

        return NextResponse.json({ admins }, { status: 200 });
    } catch (error: unknown) {
        console.error("Detailed error in GET request:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: "Failed to fetch admins", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const { adminId } = await request.json();
        if (!adminId) {
            return NextResponse.json({ message: "Admin ID is required" }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return NextResponse.json({ message: "Admin not found" }, { status: 404 });
        }

        await Admin.deleteOne({ _id: adminId });

        return NextResponse.json({ message: "Admin removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE request:", error);
        return NextResponse.json({ message: "Failed to remove admin" }, { status: 500 });
    }
}