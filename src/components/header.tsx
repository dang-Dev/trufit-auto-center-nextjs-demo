"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import * as context from "@/context";
import { RegisterModal } from "./Modal/RegisterModal";
import { LoginModal } from "./Modal/LoginModal";
import ForgotPasswordModal from "./Modal/ForgotPasswordModal";
import UserNotificationBell from "./UserNotificationBell";

const navigation = [
    { name: "Home", href: "/#home", current: false },
    { name: "Services", href: "/#services", current: false },
    // { name: "Testimonial", href: "/#testimonial", current: false },
    { name: "AboutUs", href: "/#about-us", current: false },
    { name: "FAQs", href: "/#faqs", current: false },
];

function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(" ");
}

export default function Header() {
    const { data: session } = useSession();
    const [sign_in_modal, toggleModal] = useState(false);
    const [sign_up_modal, toggleRegModal] = useState(false);
    const [forgot_password_modal, toggleForgotPasswordModal] = useState(false);
    const [setting_modal, toggleSettingModal] = useState(false);

    const modalState = useMemo(
        () => ({
            toggleSignUpModal: toggleRegModal,
            toggleSignInModal: toggleModal,
            toggleForgotPasswordModal: toggleForgotPasswordModal,
            toggleSettingModal: toggleSettingModal,
            modalSignUpState: sign_up_modal,
            modalSignInState: sign_in_modal,
            modalForgotPassState: forgot_password_modal,
            modalSettingState: setting_modal,
        }),
        [sign_in_modal, sign_up_modal, forgot_password_modal, setting_modal]
    );

    return (
        <context.MessageModalContext.Provider value={modalState}>
            <header className="sticky top-0 z-40 shadow-lg">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                                <div className="relative flex h-16 items-center justify-between">
                                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                        {/* Mobile menu button*/}
                                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                        <div className="flex flex-shrink-0 items-center">
                                            <div className="bg-slate-50 rounded-sm p-2 w-24 h-9 lg:w-32 lg:h-9 xl:w-32 xl:h-9 relative">
                                                <Image src={"/images/trufit-logo.png"} fill priority alt="Logo" />
                                            </div>
                                        </div>
                                        <div className="hidden sm:ml-6 sm:block">
                                            <div className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        // spy={true}
                                                        // smooth={true}
                                                        // duration={500}
                                                        // offset={-60}
                                                        // activeClass="bg-gray-700 text-white"
                                                        className={classNames(
                                                            "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                            "rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                                                        )}
                                                        aria-current={item.current ? "page" : undefined}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                        {/* <button
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button> */}

                                        {/* Profile dropdown */}
                                        {session ? (
                                            <Menu as="div" className="relative ml-3">
                                                <div className="flex content-center">
                                                    <UserNotificationBell />
                                                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm">
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        <UserCircleIcon className="h-8 w-8 rounded-full text-white" />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/profile"
                                                                    className={classNames(
                                                                        active ? "bg-gray-100" : "",
                                                                        "block px-4 py-2 text-sm text-gray-700"
                                                                    )}
                                                                >
                                                                    Your Profile
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/view-appointment"
                                                                    className={classNames(
                                                                        active ? "bg-gray-100" : "",
                                                                        "block px-4 py-2 text-sm text-gray-700"
                                                                    )}
                                                                >
                                                                    View Appointment
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/settings"
                                                                    className={classNames(
                                                                        active ? "bg-gray-100" : "",
                                                                        "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                                                    )}
                                                                >
                                                                    Settings
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    type="button"
                                                                    className={classNames(
                                                                        active ? "bg-gray-100" : "",
                                                                        "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                                                    )}
                                                                    onClick={() => signOut()}
                                                                >
                                                                    Sign out
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        ) : (
                                            <button
                                                className="px-3 py-1.5 text-sm rounded-md text-gray-800 font-bold bg-white hover:bg-gray-200"
                                                onClick={() => modalState.toggleSignInModal(true)}
                                            >
                                                Login
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="sm:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            // spy={true}
                                            // smooth={true}
                                            // duration={500}
                                            // offset={-60}
                                            // activeClass="bg-gray-700 text-white"
                                            className={classNames(
                                                "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                "block rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                                            )}
                                            aria-current={item.current ? "page" : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </header>
            <LoginModal />
            <RegisterModal />
            <ForgotPasswordModal />
        </context.MessageModalContext.Provider>
    );
}
