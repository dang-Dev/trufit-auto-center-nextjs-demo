import { signOut, useSession } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";

export const AccountNav = (props: any) => {
    const { data: session, status } = useSession();
    
    if (status === "loading") {
        return <></>;
    }
    if (session) {
        return (
            <div className="flex text-white content-center">
                {session.user?.email}{" "}
                <button
                    className="inline text-sm ml-2"
                    title="Sign-out"
                    onClick={() => signOut()}
                >
                    <PowerIcon className="h-6 w-8 text-gray-500" />
                </button>
            </div>
        );
    }
    return (
        <button
            className="px-3 py-1.5 text-sm rounded-md text-gray-800 font-bold bg-white hover:bg-gray-200"
            onClick={() => props.toggleModal(true)}
        >
            Login
        </button>
    );
};
