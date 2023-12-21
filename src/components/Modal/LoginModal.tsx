"use client";
import Image from "next/image";
import { Fragment, useRef, useState, FormEvent, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signIn } from "next-auth/react";
import { MessageModalContext } from "@/context";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export function LoginModal() {
    const cancelButtonRef = useRef(null);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const modalState = useContext(MessageModalContext);
    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

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
                callbackUrl: `${process.env.BASE_PATH}/`,
                recaptchaToken: recaptchaToken,
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
                modalState?.toggleSignInModal(false);
                router.refresh();
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }

    const handleOnClose = () => {
        modalState?.toggleSignInModal(false);
    };

    const handleRegisterBtn = () => {
        modalState?.toggleSignUpModal(true);
        modalState?.toggleSignInModal(false);
    };

    const handleForgotPassword = () => {
        modalState?.toggleForgotPasswordModal(true);
        modalState?.toggleSignInModal(false);
    };

    return (
        <Transition.Root show={modalState?.modalSignInState} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={() => handleOnClose()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="lg:flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                <form action="" onSubmit={onSubmit}>
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="">
                                            <div className="mt-3 text-center sm:mt-0">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    Sign In
                                                </Dialog.Title>
                                                <div className="mb-2 mt-2">
                                                    <label
                                                        htmlFor="price"
                                                        className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                    >
                                                        Username
                                                    </label>
                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            value={userName}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                setUserName(e.currentTarget.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <label
                                                        htmlFor="price"
                                                        className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                        <input
                                                            type="password"
                                                            name="phone-number"
                                                            className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            value={password}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                setPassword(e.currentTarget.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                {process.env.RECAPTCHA_SITE_KEY && (
                                                    <ReCAPTCHA
                                                        sitekey={process.env.RECAPTCHA_SITE_KEY}
                                                        onChange={(token) => setRecaptchaToken(token)}
                                                    />
                                                )}

                                                <div className="text-left mt-2 text-xs text-neutral-700">
                                                    Doesn&apos;t have an account yet?{" "}
                                                    <span
                                                        className="text-blue-500 cursor-pointer hover:text-blue-800 hover:underline"
                                                        onClick={() => handleRegisterBtn()}
                                                    >
                                                        Register here
                                                    </span>
                                                </div>
                                                <div className="text-left mt-0 text-xs text-neutral-700">
                                                    Forgot your password?
                                                    <span
                                                        onClick={() => handleForgotPassword()}
                                                        className="text-blue-500 cursor-pointer hover:text-blue-800 hover:underline"
                                                    >
                                                        click here
                                                    </span>
                                                </div>
                                                {/* Divider */}
                                                <div className="flex items-center mt-5 mb-5">
                                                    <hr className="flex-grow border-t border-gray-300" />
                                                    <span className="px-3 text-gray-500">or</span>
                                                    <hr className="flex-grow border-t border-gray-300" />
                                                </div>

                                                {/* TODO: Sign in with google account need to save it on the user DB table */}
                                                <button
                                                    type="button"
                                                    className="p-2 rounded-md shadow-lg w-full bg-slate-100"
                                                    onClick={() => signIn("google")}
                                                >
                                                    <Image
                                                        className="inline mr-2"
                                                        src={"/images/google.png"}
                                                        width={24}
                                                        height={24}
                                                        alt="google"
                                                    />{" "}
                                                    Sign in with Google
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            {isLoading ? (
                                                <Image
                                                    src={"/images/Spin.gif"}
                                                    className="mx-auto"
                                                    width={20}
                                                    height={20}
                                                    alt="Loading"
                                                />
                                            ) : (
                                                "Login"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => handleOnClose()}
                                            disabled={isLoading}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
