import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
    return (
        <button
            className="px-3 py-1.5 text-sm rounded-md text-white bg-gray-900 hover:bg-gray-700"
            onClick={() => signIn()}
        >
            Sign in
        </button>
    );
};

export const RegisterButton = () => {
    return (
        <Link href="/register" style={{ marginRight: 10 }}>
            Register
        </Link>
    );
};

export const LogoutButton = () => {
    return (
        <button style={{ marginRight: 10 }} onClick={() => signOut()}>
            Sign Out
        </button>
    );
};

export const ProfileButton = () => {
    return <Link href="/profile">Profile</Link>;
};
