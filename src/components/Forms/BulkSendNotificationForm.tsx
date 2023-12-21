"use client";

import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SelectedUser = {
    id: string;
    firstName: string;
    lastName: string;
};

export default function BulkSendNotificationForm() {
    const max_sms_length = 150;
    const max_email_length = 300;
    const [message_type, setMessageType] = useState({ email: true, sms: true });
    const [sms_message, setSmsMessage] = useState("");
    const [email_message, setEmailMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selected_users, setSelectedUsers] = useState<SelectedUser[]>([]);
    const router = useRouter();

    async function getUsers(encoded_params: string | null) {
        try {
            const encoded_url = `${process.env.BASE_PATH}/api/auth/user?selected_ids=${encodeURIComponent(encoded_params+'')}`
            const res = await fetch(encoded_url, {
                cache: "no-cache",
            });
            if (!res.ok) {
                throw new Error("Failed Fetching data.");
            }
            const data = await res.json();
            window.sessionStorage.removeItem("selected_ids");
            setSelectedUsers(data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (window.sessionStorage.getItem("selected_ids") === null) {
            router.push("/admin/user");
        } else {
            const session_ids = window.sessionStorage.getItem("selected_ids");
            getUsers(session_ids);
        }
    }, []);

    const handleOnChangeCheckBox = (data: { email: boolean; sms: boolean }) => {
        setMessageType(data);
    };

    const handleChangeTextAreaSMS = (value: string) => {
        if (value.length > max_sms_length) {
            alert("You reach the max length of character available to send");
        } else {
            setSmsMessage(value);
        }
    };

    const handleChangeTextAreaEmail = (value: string) => {
        if (value.length > max_email_length) {
            alert("You reach the max length of character available to send");
        } else {
            setEmailMessage(value);
        }
    };

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const ids = selected_users.map((e) => e.id)
        try {
            const res = await fetch("/api/send-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uuid: ids.toString(),
                    is_email: message_type.email,
                    is_sms: message_type.sms,
                    email_message: email_message,
                    sms_message: sms_message,
                }),
            });

            const resJson = await res.json();

            if (resJson.status === 500) {
                throw new Error("Something went wrong!");
            }
            if (res.status === 200) {
                router.push("/admin/user");
                toast.success("Successfully send.", {
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
    };

    return (
        <>
            <ul className="list-inside border-2 list-disc shrink max-h-[200px] overflow-y-scroll px-3 py-1 rounded mb-4">
                {selected_users.length > 0 &&
                    selected_users.map((ele) => (
                        <li key={ele.id}>
                            {ele.firstName} {ele.lastName}
                        </li>
                    ))}
            </ul>
            <form onSubmit={handleOnSubmit}>
                <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                        Please select notification type.
                    </legend>
                    <div className="mt-2 flex space-x-4">
                        <div className="relative flex gap-x-2">
                            <div className="flex h-6 items-center">
                                <input
                                    id="by-email"
                                    name="by-email"
                                    type="checkbox"
                                    checked={message_type.email}
                                    onChange={() =>
                                        handleOnChangeCheckBox({
                                            email: !message_type.email,
                                            sms: message_type.sms,
                                        })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="by-email" className="font-medium text-gray-900">
                                    By Email
                                </label>
                            </div>
                        </div>
                        <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                                <input
                                    id="by-sms"
                                    name="by-sms"
                                    type="checkbox"
                                    checked={message_type.sms}
                                    onChange={() =>
                                        handleOnChangeCheckBox({
                                            email: message_type.email,
                                            sms: !message_type.sms,
                                        })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                            </div>
                            <div className="text-sm leading-6">
                                <label htmlFor="by-sms" className="font-medium text-gray-900">
                                    By SMS
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div className="space-y-12 mt-4">
                    {message_type.email && (
                        <div className="col-span-full">
                            <label htmlFor="send-email" className="block text-sm font-medium leading-6 text-gray-900">
                                Message to send through EMAIL:
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={5}
                                    value={email_message}
                                    onChange={(e) => handleChangeTextAreaEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                ></textarea>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Write a few sentences you want to know by your client.{" "}
                                <span className="text-sm text-slate-700 float-right">
                                    {email_message.length}/{max_email_length}
                                </span>
                            </p>
                        </div>
                    )}
                    {message_type.sms && (
                        <div className="col-span-full">
                            <label htmlFor="send-email" className="block text-sm font-medium leading-6 text-gray-900">
                                Message to send through SMS:
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={5}
                                    value={sms_message}
                                    onChange={(e) => handleChangeTextAreaSMS(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                ></textarea>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Write a few sentences you want to know by your client, but not more than 150 characters.
                                <span className="text-sm text-slate-700 float-right">
                                    {sms_message.length}/{max_sms_length}
                                </span>
                            </p>
                        </div>
                    )}
                    {(message_type.email || message_type.sms) && (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
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
                                "Send Notification"
                            )}
                        </button>
                    )}
                </div>
            </form>
        </>
    );
}
