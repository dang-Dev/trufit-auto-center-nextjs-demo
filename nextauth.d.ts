import { DefaultSession, DefaultUser, Profile  } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string;
        username?: string;
        isEmailVerify: boolean,
        notifType:string
    }
    interface Session extends DefaultSession {
        user?: User;
    }
    interface Profile {
        sub?: string
        name?: string
        email?: string
        image?: string
        email_verified?: boolean;
      }
}
