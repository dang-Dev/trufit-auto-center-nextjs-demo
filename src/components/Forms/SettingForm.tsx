"use client";

import Image from "next/image";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SettingForm({ uuid, notification }: { uuid: string; notification: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [notif_type, setNotifType] = useState('');

    useEffect(() => {
        setNotifType(notification);
    }, [notification]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notifType: notif_type,
                    uuid: uuid,
                }),
            });

            const resJson = await res.json();

            if (resJson.status === 500) {
                throw new Error("Something went wrong!");
            }
            if (res.status === 200) {
                router.push("/");
                toast.success("Save Changes", {
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
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }
    const handleChange = (e: string) => {
        setNotifType(e);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="pb-4">
                <div className="mt-4 space-y-10">
                    <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">
                            Appointment Notifications
                        </legend>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please choice the type of notification you want.
                        </p>
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-sms"
                                    name="push-notifications"
                                    type="radio"
                                    checked={notif_type === "SMS"}
                                    onChange={() => handleChange("SMS")}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                    htmlFor="push-everything"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    SMS Only
                                </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-email"
                                    name="push-notifications"
                                    type="radio"
                                    checked={notif_type === "EMAIL"}
                                    onChange={() => handleChange("EMAIL")}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                    htmlFor="push-email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email Only
                                </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-nothing"
                                    name="push-notifications"
                                    type="radio"
                                    checked={notif_type === "NOTHING"}
                                    onChange={() => handleChange("NOTHING")}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                    htmlFor="push-nothing"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    No notifications
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className=" sm:flex">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                >
                    {isLoading ? (
                        <Image src={"/images/Spin.gif"} className="mx-auto" width={20} height={20} alt="Loading" />
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}
