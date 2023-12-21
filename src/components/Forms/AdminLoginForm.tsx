"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function AdminLoginForm() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!recaptchaToken) {
            console.error("reCAPTCHA not verified");
            alert("reCAPTCHA not verified");
            return;
        }
        setIsLoading(true);

        try {
            const signInData = await signIn("credentials", {
                username: userName,
                password: password,
                redirect: false,
                callbackUrl: `${process.env.BASE_PATH}/admin/dashboard`,
                recaptchaToken: recaptchaToken
            });
            if (signInData?.error) {
                const err =
                    signInData.error === "CredentialsSignin" ? "Invalid Username or Password!" : signInData.error;
                toast.error(err, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setUserName("");
                setPassword("");
            } else {
                setUserName("");
                setPassword("");
                toast.success("Login Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                router.push("/admin/dashboard");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }
    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                </label>
                <div className="mt-2">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="block w-full text-center rounded-md border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                    </label>
                    {/* <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div> */}
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {process.env.RECAPTCHA_SITE_KEY && (
                <ReCAPTCHA sitekey={process.env.RECAPTCHA_SITE_KEY} onChange={(token) => setRecaptchaToken(token)} />
            )}
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {isLoading ? (
                        <Image src={"/images/Spin.gif"} className="mx-auto" width={20} height={20} alt="Loading" />
                    ) : (
                        "Login"
                    )}
                </button>
            </div>
        </form>
    );
}
