import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { findUserByEmail } from "./utils/prisma";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // name: "Credentials",
            // credentials: {
            //     username: {
            //         label: "text",
            //         type: "text",
            //     },
            //     password: { label: "Password", type: "password" },
            // },
            // @ts-ignore
            async authorize(credentials: { username: string; password: string; recaptchaToken: string }) {
                if (!(credentials?.username || credentials?.password)) {
                    return null;
                }
                const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
                const recaptchaResponse = await axios.post(
                    "https://www.google.com/recaptcha/api/siteverify",
                    {
                        secret: recaptchaSecretKey,
                        response: credentials?.recaptchaToken,
                    },
                    { headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" } }
                );
              
                if (recaptchaResponse.data.success) {
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username },
                    });

                    if (!user) return null;

                    const passwordMatch = await compare(credentials.password, user.password ?? "");

                    if (!passwordMatch) return null;

                    return {
                        id: `${user.id}`,
                        email: user.email,
                        role: user.role,
                        username: user.username,
                        isEmailVerify: user.isEmailVerify,
                        notifType: user.notifType,
                    };
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ session, token, user, trigger }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    username: token.username,
                    isEmailVerify: token.isEmailVerify,
                    notifType: token.notifType,
                },
            };
        },
        async jwt({ token, user, account }) {
            // console.log("account",account)
            if (account?.provider === "credentials") {
                if (user) {
                    return {
                        ...token,
                        id: user.id,
                        role: user.role ?? "BASIC",
                        username: user.username,
                        isEmailVerify: user.isEmailVerify,
                        notifType: user.notifType,
                    };
                }
            } else if (account?.provider === "google") {
                if (user?.email) {
                    const current_user = await findUserByEmail(user.email);
                    return {
                        ...token,
                        id: current_user?.id,
                        role: current_user?.role ?? "BASIC",
                        username: current_user?.username,
                        isEmailVerify: current_user?.isEmailVerify,
                        notifType: current_user?.notifType,
                    };
                }
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const find_user = await prisma.user.findUnique({
                    where: { email: profile?.email },
                });

                if (!find_user?.isEmailVerify) {
                    return false;
                }

                if (find_user?.email === profile?.email) {
                    if (profile?.email_verified) {
                        return true;
                    }
                }

                if (profile?.email) {
                    return `/unauthorized/${encodeURIComponent(btoa(profile?.email))}`;
                }
            }

            if (user.role === "ADMIN") {
                return true;
            }

            return user.isEmailVerify; // Do different verification for other providers that don't have `email_verified`
        },
    },
};
