// app/api/user/[id]/route.js
import User from "@/models/user"
import dbConnect from "@/utils/database"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DoctorSpecialtyList } from "@/data/doctorSpecialty.enum"

export const GET = async (request, { params }) => {
    try {
        await dbConnect()
        const existingUser = await User.findById(params.id)
        if (!existingUser) {
            return new Response("User not found", { status: 404 })
        }
        existingUser.password = undefined // Remove sensitive data
        return new Response(JSON.stringify(existingUser), { status: 200 })
    } catch (error) {
        return new Response(`Error Getting User ${error}`, { status: 500 })
    }
}

export const PATCH = async (request, { params }) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { firstName, lastName, gender, dob, countries, languages, doctorSpecialty, accountType, removeSpecialty } =
        await request.json()

    try {
        await dbConnect()

        const existingUser = await User.findById(params.id)

        if (!existingUser) {
            return new Response("User not found", { status: 404 })
        }

        // Update fields
        if (firstName) existingUser.firstName = firstName
        if (lastName) existingUser.lastName = lastName
        if (gender) existingUser.gender = gender
        if (dob) existingUser.dob = new Date(dob)
        if (countries) existingUser.countries = countries
        if (languages) existingUser.languages = languages
        if (accountType) existingUser.accountType = accountType

        // Add or remove specialties
        if (doctorSpecialty) {
            existingUser.doctorSpecialty = doctorSpecialty.filter((specialty) =>
                Object.values(DoctorSpecialtyList).includes(specialty),
            )
        }
        if (removeSpecialty) {
            existingUser.doctorSpecialty = existingUser.doctorSpecialty.filter((specialty) => specialty !== removeSpecialty)
        }

        await existingUser.save()

        // Update the session
        if (session && session.user) {
            session.user = {
                ...session.user,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                gender: existingUser.gender,
                dob: existingUser.dob,
                countries: existingUser.countries,
                languages: existingUser.languages,
                doctorSpecialty: existingUser.doctorSpecialty,
                accountType: existingUser.accountType,
            }
        }

        return new Response(
            JSON.stringify({
                _id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                gender: existingUser.gender,
                dob: existingUser.dob,
                countries: existingUser.countries,
                languages: existingUser.languages,
                doctorSpecialty: existingUser.doctorSpecialty,
                accountType: existingUser.accountType,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        )
    } catch (error) {
        return new Response(`Error Updating User: ${error}`, { status: 500 })
    }
}

