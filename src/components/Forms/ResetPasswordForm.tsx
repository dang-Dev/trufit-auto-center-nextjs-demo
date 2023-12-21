"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordForm({ uuid }: { uuid: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);

    const isPasswordMatch = () => {
        if (password !== "" && password1 !== "") {
            return password !== password1;
        }
        return false;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsError(false);
        try {
            const res = await fetch(`/api/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uuid,
                    password,
                }),
            });

            if (res.status !== 200) {
                throw new Error("Something went wrong!");
            }
            toast.success("Reset link successfully send to your email", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setError(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-2 ">
                <label htmlFor="price" className="block text-sm text-left font-medium leading-6 text-gray-900">
                    New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                        type="password"
                        name="password"
                        className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="mb-2 ">
                <label htmlFor="price" className="block text-sm text-left font-medium leading-6 text-gray-900">
                    Re-type New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                        type="password"
                        name="retype-password"
                        className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                    />
                </div>
            </div>
            {isPasswordMatch() && <div className=" text-red-500 text-sm">Password doesn&apos;t match!</div>}
            {isError && <div className="p-2 mt-1 bg-red-500 text-white text-xs rounded">ERROR: {error}</div>}
            <button
                type="submit"
                disabled={isPasswordMatch()}
                className="w-full mt-3 disabled:bg-slate-300 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
                Send Password Reset Link
            </button>
        </form>
    );
}
