"use client";

import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { pusherClient } from "@/lib/pusher";
import { Appointment, User, Event } from "@prisma/client";
import moment from "moment";
import { toast } from "react-toastify";

const callsToAction = [{ name: "View All Appointment", href: "/admin/appointment" }];

interface NewAppointment extends Appointment {
    customer: User;
    event: Event;
}

type notification = {
    id: string;
    appointmentId: string;
    appointment: NewAppointment;
    un_read: boolean;
    created_at: Date;
};

const DropdownNotification = () => {
    const [notifications, setNotification] = useState<notification[]>([]);
    const [incoming_notification, setIncomingNotification] = useState<notification[]>([]);
    const [total_unread, setTotalUnread] = useState(0);

    useEffect(() => {
        const getNotifications = async () => {
            const result = await fetch("/api/notification", { cache: 'no-store' });

            if (!result.ok) {
                throw new Error("Failed Fetching data.");
            }
            const { data, total_unread } = await result.json();
            setNotification([...data]);
            setTotalUnread(total_unread);
        };
        getNotifications();
    }, []);

    useEffect(() => {
        pusherClient.subscribe("notification");

        pusherClient.connection.bind("connected", function () {
            console.log("Realtime is go!")
          });
        pusherClient.bind("incoming-notification", (data: any) => {
            setIncomingNotification((prev) => [...prev, data.message]);
            toast.info("New Appointment Received", {
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

        return () => {
            pusherClient.unsubscribe("notification");
        };
    }, []);

    return (
        <Popover className="relative">
            <Popover.Button className="inline-flex items-center gap-x-1 text-sm leading-6 text-gray-300 hover:bg-gray-700 bg-gray-600 hover:text-white p-1 rounded-full">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                </svg>
                {total_unread > 0 && (
                    <div className="absolute top-0 right-0">
                        {" "}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>{" "}
                    </div>
                )}
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
                <Popover.Panel className="absolute left-10 z-[100] mt-5 flex w-screen max-w-max -translate-x-full px-4">
                    <div className="w-screen max-w-[30rem] flex-auto max-h-96 overflow-y-scroll rounded-md bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                            {incoming_notification.map((item) => (
                                <NotificationItem key={item.id} item={item} />
                            ))}
                            {notifications.map((item) => (
                                <NotificationItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="divide-x divide-gray-900/5 bg-gray-50">
                            {callsToAction.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default DropdownNotification;

export function NotificationItem({ item }: { item: notification }) {
    return (
        <div className={`group relative rounded p-4 mb-2 hover:bg-gray-200 bg-gray-100`}>
            <a href={`/admin/appointment/${item.appointmentId}/${item.id}`}>
                {item.un_read && (
                    <div className="absolute top-0 right-0">
                        {" "}
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>{" "}
                    </div>
                )}

                <div>
                    Appointment:{moment(item.appointment.event.start).format("lll")} -{" "}
                    {moment(item.appointment.event.end).format("lll")}
                </div>
                <div>
                    Customer: {item.appointment.customer.firstName} {item.appointment.customer.lastName}
                </div>
                <span className="text-gray-600 text-xs text-right absolute bottom-2 right-2">
                    {moment(item.created_at).fromNow()}
                </span>
            </a>
        </div>
    );
}
