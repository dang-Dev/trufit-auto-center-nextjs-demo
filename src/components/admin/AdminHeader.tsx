"use client";

import Link from "next/link";
import Image from "next/image";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signOut } from "next-auth/react";
import DropdownNotification from "../DropdownNotification";

export default function AdminHeader({ slug }: { slug: string }) {
    const current_class = "bg-gray-900 text-white";
    const default_class = "text-gray-300 hover:bg-gray-700 hover:text-white";
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-slate-50 p-1 rounded-sm">
                                <Image src={"/images/trufit-logo.png"} width={120} height={40} alt="Logo" />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        href="/admin/dashboard"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            slug === "dashboard" ? current_class : default_class
                                        }`}
                                        aria-current="page"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/appointment"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            slug === "appointment" ? current_class : default_class
                                        }`}
                                    >
                                        Appointment
                                    </Link>
                                    <Link
                                        href="/admin/user"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            slug === "user" ? current_class : default_class
                                        }`}
                                    >
                                        User
                                    </Link>
                                    <Link
                                        href="/admin/calendar"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            slug === "calendar" ? current_class : default_class
                                        }`}
                                    >
                                        Calendar
                                    </Link>
                                    <Link
                                        href="/admin/feedback"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            slug === "feedback" ? current_class : default_class
                                        }`}
                                    >
                                        User Feedback
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <div className="flex gap-x-2 place-items-center">
                                    <DropdownNotification/>
                                    <div className="text-neutral-200">ADMIN</div>

                                    <button className={`${default_class} p-2 rounded`} title="Logout" onClick={()=>signOut()}>
                                        <PowerIcon className="h-6 w-6 text-neutral-200 " strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            {/* <!-- Mobile menu button --> */}
                            <button
                                type="button"
                                onClick={()=>setOpen(!open)}
                                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
                                <svg
                                    className="hidden h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                <div className={`md:hidden ${!open && 'hidden'}`} id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        <Link
                            href="/admin/dashboard"
                            className={`rounded-md px-3 py-2 text-sm font-medium block ${
                                slug === "dashboard" ? current_class : default_class
                            }`}
                            aria-current="page"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/appointment"
                            className={`rounded-md px-3 py-2 text-sm font-medium block ${
                                slug === "appointment" ? current_class : default_class
                            }`}
                        >
                            Appointment
                        </Link>
                        <Link
                            href="/admin/user"
                            className={`rounded-md px-3 py-2 text-sm font-medium block ${
                                slug === "user" ? current_class : default_class
                            }`}
                        >
                            User
                        </Link>
                        <Link
                            href="/admin/calendar"
                            className={`rounded-md px-3 py-2 text-sm font-medium block ${
                                slug === "calendar" ? current_class : default_class
                            }`}
                        >
                            Calendar
                        </Link>
                        <Link
                            href="/admin/feedback"
                            className={`rounded-md px-3 py-2 text-sm font-medium block ${
                                slug === "feedback" ? current_class : default_class
                            }`}
                        >
                            Feedback
                        </Link>
                        {/* <a
                            href="#"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                        >
                            Reports
                        </a> */}
                        <button
                            type="button"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex content-center"
                        >
                            <PowerIcon className="h-5 w-5 text-neutral-200 inline me-1" strokeWidth={2} />
                            Sign-out
                        </button>
                    </div>
                </div>
            </nav>

            <header className="bg-neutral-200 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">{slug}</h1>
                </div>
            </header>
        </>
    );
}
