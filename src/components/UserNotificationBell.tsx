"use client";

import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon, BellAlertIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { Appointment } from "@prisma/client";
import Link from "next/link";
import moment from "moment";
import { pusherClient } from "@/lib/pusher";
import { toast } from "react-toastify";

export default function UserNotificationBell() {
    const [notifications, setNotifications] = useState<Appointment[]>([]);
    const [incoming_notification, setIncomingNotification] = useState<Appointment[]>([]);

    useEffect(() => {
        async function getNotification() {
            try {
                const res = await fetch(`${process.env.BASE_PATH}/api/appointment?limit=10&status=APPROVED`, {
                    cache: "no-cache",
                });
                if (!res.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const notifications = await res.json();
                setNotifications(notifications.data);
            } catch (error) {
                console.log(error);
            }
        }
        pusherClient.subscribe("user-notification");

        pusherClient.connection.bind("connected", function () {
            console.log("Realtime is go!");
        });
        pusherClient.bind("user-incoming-notification", (data: any) => {
            setIncomingNotification((prev) => [...prev, data.message]);
            toast.info("Appointment Approved", {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });
        getNotification();
        return () => {
            pusherClient.unsubscribe("user-notification");
        };
    }, []);

    return (
        <div className="w-full max-w-sm px-4">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`
                ${open ? "text-white" : "text-white/90"}
                group inline-flex items-center rounded-md text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                            <BellAlertIcon className="h-8 w-8 rounded-full text-white" />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute left-10 z-10 mt-3 w-screen max-w-sm -translate-x-full transform px-4 sm:px-0">
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                    <div className="relative grid gap-3 bg-white p-7">
                                        {incoming_notification.map((item) => (
                                            <Item key={item.id} item={item} />
                                        ))}
                                        {notifications.map((item) => (
                                            <Item key={item.id} item={item} />
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 p-2">
                                        <a
                                            href="/view-appointment"
                                            className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                                        >
                                            <span className="flex justify-center">
                                                <Link
                                                    href={"/view-appointment"}
                                                    className="text-sm font-medium text-gray-900"
                                                >
                                                    View All Appointment
                                                </Link>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}

function Item({ item }: { item: any }) {
    return (
        <>
            <div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                <InformationCircleIcon className="h-8 w-8 text-gray-500" />
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">You&apos;re Appointment have been approved.</p>
                    <p className="text-sm font-medium text-gray-900">Car Brand: {item.carBrand}</p>
                    <p className="text-xs text-gray-500 text-right">{moment(item.updateAt).fromNow()}</p>
                </div>
            </div>
            <hr />
        </>
    );
}
