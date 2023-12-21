"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState, FormEvent } from "react";
import { MessageModalContext } from "@/context";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ForgotPasswordModal() {
    const modalState = useContext(MessageModalContext);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                }),
            });

            const resJson = await res.json();

            if (res.status === 409) {
                throw new Error(resJson.message);
            }

            if (res.status === 500) {
                throw new Error("Something went wrong!");
            }

            if (res.status === 200) {
                modalState?.toggleForgotPasswordModal(false);
                toast.success("Email has been sent to your email!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <>
            <Transition appear show={modalState?.modalForgotPassState} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => modalState?.toggleForgotPasswordModal(false)}>
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Reset Password
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                            >
                                                Email Address
                                            </label>
                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={email}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setEmail(e.currentTarget.value)
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="text-neutral-600 text-xs mt-2">
                                            Please input the email you used on your account.
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Send Password Reset Link
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
