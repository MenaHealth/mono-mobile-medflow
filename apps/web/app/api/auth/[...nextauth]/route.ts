// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Account, Profile } from 'next-auth';

import User from '@/models/user';
import Admin from '@/models/admin';
import dbConnect from '@/utils/database';
import { Languages } from "@/data/languages.enum";
import { Countries } from "@/data/countries.enum";
import { DoctorSpecialtyList } from '@/data/doctorSpecialty.enum';

type AccountType = "Doctor" | "Triage" | "Evac";

interface SessionUser extends NextAuthUser {
    id: string;
    _id: string;
    email: string;
    accountType: AccountType;
    firstName: string;
    lastName: string;
    city: string;
    countries: Countries[];
    languages: Languages[];
    doctorSpecialty?: DoctorSpecialtyList[];
    image?: string;
    isAdmin: boolean;
    dob?: string | Date;
    gender?: 'Male' | 'Female';
    token?: string;
    googleImage?: string;
    googleEmail?: string;
    googleId?: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface GoogleProfile extends Profile {
    given_name?: string;
    family_name?: string;
    picture?: string;
}

function createSessionUser(user: any, isAdmin: boolean, accountType: AccountType): SessionUser {
    return {
        id: user._id.toString(),
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType,
        city: user.city || '',
        countries: user.countries || [],
        languages: user.languages || [],
        doctorSpecialty: Array.isArray(user.doctorSpecialty)
            ? user.doctorSpecialty.filter((specialty: string) =>
                Object.values(DoctorSpecialtyList).includes(specialty as DoctorSpecialtyList)
            ) // Ensure only valid specialties are included
            : [], // Fallback to empty array if undefined
        image: user.image,
        isAdmin: isAdmin,
        dob: user.dob,
        gender: user.gender === "Male" || user.gender === "Female" ? user.gender : undefined,
        token: undefined,
    };
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: Credentials | undefined): Promise<SessionUser | null> {
                if (!credentials) throw new Error('Missing credentials');
                const { email, password } = credentials;

                await dbConnect();

                const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).select('+authorized');

                if (!user) {
                    throw new Error('That email does not exist in our database.');
                }

                if (!user.authorized) {
                    throw new Error('Your account has not been approved yet.');
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                user.lastLogin = new Date();
                await user.save();

                const isAdmin = !!(await Admin.findOne({ userId: user._id }));

                const accountType: AccountType =
                    user.accountType === "Doctor" || user.accountType === "Triage" || user.accountType === "Evac"
                        ? user.accountType
                        : "Triage"; // Fallback value

                return createSessionUser(user, isAdmin, accountType);
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger, session }: {
            token: JWT;
            user?: User | NextAuthUser;
            account?: Account | null;
            profile?: Profile;
            trigger?: "signIn" | "signUp" | "update";
            session?: any;
        }): Promise<JWT> {
            if (trigger === 'update' && session?.user?.doctorSpecialty) {
                token.doctorSpecialty = (session.user.doctorSpecialty as string[]).filter((specialty) =>
                    Object.values(DoctorSpecialtyList).includes(specialty as DoctorSpecialtyList)
                ) as DoctorSpecialtyList[]; // Cast to DoctorSpecialtyList[]
            }
            console.log('--- JWT Callback ---');
            console.log('Token before update:', token);
            console.log('User:', user);
            console.log('Trigger:', trigger);
            console.log('Session in JWT callback:', session);

            if (user) {
                const sessionUser = user as SessionUser;
                token.id = sessionUser.id;
                token.accountType = sessionUser.accountType;
                token.firstName = sessionUser.firstName;
                token.lastName = sessionUser.lastName;
                token.city = sessionUser.city;
                token.countries = sessionUser.countries;
                token.languages = sessionUser.languages;
                token.isAdmin = sessionUser.isAdmin;
                token.image = sessionUser.image;
                token.dob = sessionUser.dob;
                token.doctorSpecialty = sessionUser.doctorSpecialty || []; // Keep as array
                token.gender = sessionUser.gender;
                token.accessToken = jwt.sign(
                    {
                        id: sessionUser.id,
                        email: sessionUser.email,
                        isAdmin: sessionUser.isAdmin,
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: '2d' }
                );
            }

            if (trigger === 'update' && session?.user?.accountType) {
                console.log('Update triggered. New account type:', session.user.accountType);
                token.accountType = session.user.accountType as AccountType;
            }

            if (account && account.provider === 'google' && profile) {
                const googleProfile = profile as GoogleProfile;
                token.googleId = googleProfile.sub;
                token.googleEmail = googleProfile.email;
                token.googleImage = googleProfile.picture;
            }

            console.log('Token after update:', token);
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token && session.user) {
                (session.user as SessionUser) = {
                    ...session.user,
                    id: token.id!,
                    _id: token.id!,
                    accountType: token.accountType as AccountType,
                    firstName: token.firstName!,
                    lastName: token.lastName!,
                    city: token.city || '',
                    countries: token.countries || [],
                    languages: token.languages || [],
                    isAdmin: !!token.isAdmin,
                    doctorSpecialty: token.doctorSpecialty || [],
                    dob: token.dob,
                    gender: token.gender,
                    token: token.accessToken,
                };
            }

            return session;
        },
        async signIn({ account, profile }): Promise<boolean | string> {
            console.log('--- SignIn Callback ---');
            console.log('Account:', account);
            console.log('Profile:', profile);

            if (account?.provider === 'google' && profile) {
                await dbConnect();
                const googleProfile = profile as GoogleProfile;
                const user = await User.findOne({ email: googleProfile.email });

                if (user) {
                    // Update existing user with Google information
                    user.googleId = googleProfile.sub;
                    user.googleEmail = googleProfile.email;
                    user.googleImage = googleProfile.picture;
                    await user.save();
                    return true;
                } else {
                    // User doesn't exist, redirect to sign up page
                    if (!googleProfile.email) {
                        throw new Error('Google profile email is missing');
                    }
                    return `/auth/signup?email=${encodeURIComponent(googleProfile.email)}`;
                }
            }
            return true; // Allow sign in for other providers
        },
    },
    pages: {
        signIn: '/auth/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

