// apps/web/app/api/admin/user/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { verifyAdminToken, initializeDatabase } from "@/utils/adminAPI";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await verifyAdminToken(request);

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        await initializeDatabase();
        const existingUser = await User.findById(params.id).select("-password");
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(existingUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error getting user: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await verifyAdminToken(request);

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const {
        firstName,
        lastName,
        gender,
        dob,
        countries,
        languages,
        doctorSpecialty,
        accountType,
        googleId,
        googleEmail,
        googleImage
    } = await request.json();

    try {
        await initializeDatabase();

        const existingUser = await User.findById(params.id);

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update only the fields that are allowed to be edited
        if (firstName) existingUser.firstName = firstName;
        if (lastName) existingUser.lastName = lastName;
        if (gender) existingUser.gender = gender;
        if (dob) existingUser.dob = new Date(dob);
        if (countries) existingUser.countries = countries;
        if (languages) existingUser.languages = languages;
        if (doctorSpecialty) existingUser.doctorSpecialty = doctorSpecialty;
        if (accountType) existingUser.accountType = accountType;

        // Update Google-related fields
        if (googleId !== undefined) existingUser.googleId = googleId;
        if (googleEmail !== undefined) existingUser.googleEmail = googleEmail;
        if (googleImage !== undefined) existingUser.googleImage = googleImage;

        await existingUser.save();

        const updatedUser = existingUser.toObject();
        delete updatedUser.password;

        return NextResponse.json(updatedUser, { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return NextResponse.json({ message: `Error updating user: ${error.message}` }, { status: 500 });
    }
}