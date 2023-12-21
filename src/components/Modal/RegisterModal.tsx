"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState, FormEvent, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import MessageModal from "./MessageModal";
import { MessageModalContext } from "@/context";
import moment from "moment";
import ReCAPTCHA from "react-google-recaptcha";

export function RegisterModal() {
    const cancelButtonRef = useRef(null);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [contact_number, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [birth_date, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [gender, setGender] = useState("");
    const [street_name, setStreetName] = useState("");
    const [city_name, setCityName] = useState("");
    const [province_name, setProvinceName] = useState("");
    const [zip_code, setZipCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");

    const modalState = useContext(MessageModalContext);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!recaptchaToken) {
            console.error("reCAPTCHA not verified");
            alert("reCAPTCHA not verified");
            return;
        }
        setIsLoading(true);

        try {
            if (password !== password1) {
                setError("Password Don't Match!");
                setIsError(true);
            }

            if (userName !== "" && password == password1) {
                const res = await fetch("/api/auth/user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        first_name: first_name,
                        last_name: last_name,
                        contact_number: contact_number,
                        email: email,
                        username: userName,
                        password: password,
                        birth_date: birth_date,
                        gender: gender,
                        street_name,
                        city_name,
                        province_name,
                        zip_code,
                    }),
                });
                if (res.status === 201) {
                    console.log("OK");
                    setFirstName("");
                    setLastName("");
                    setContactNumber("");
                    setUserName("");
                    setPassword("");
                    setPassword1("");
                    setGender("");
                    setStreetName("");
                    setCityName("");
                    setProvinceName("");
                    setZipCode("");
                    modalState?.toggleSignUpModal(false);
                    setHeader("Great, " + first_name + " " + last_name);
                    setMessage(
                        "You successfully register. Please verify your email first before you can login your account.."
                    );
                } else {
                    const returnMessage = await res.json();
                    setError(returnMessage.message);
                    setIsError(true);
                }
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    const handleOnClose = () => {
        modalState?.toggleSignUpModal(false);
        setIsError(false);
        setFirstName("");
        setLastName("");
        setContactNumber("");
        setUserName("");
        setPassword("");
        setPassword1("");
    };

    return (
        <>
            <Transition.Root show={modalState?.modalSignUpState} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    initialFocus={cancelButtonRef}
                    onClose={() => handleOnClose()}
                >
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
                        <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                                    <form action="" onSubmit={onSubmit}>
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="">
                                                <div className="mt-3 text-center sm:mt-0">
                                                    <div className="mx-auto w-16 mb-2">
                                                        <Image
                                                            src={"/trufit-logo.png"}
                                                            width={64}
                                                            height={64}
                                                            alt="Logo"
                                                        />
                                                    </div>
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-base font-semibold leading-6 text-gray-900 "
                                                    >
                                                        Register New Customer Account
                                                    </Dialog.Title>
                                                    <div className="grid grid-cols-2 gap-2 mt-5">
                                                        <div className="">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                First Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    name="First Name"
                                                                    className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={first_name}
                                                                    onChange={(e) => setFirstName(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Last Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    name="Last Name"
                                                                    className=" w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={last_name}
                                                                    onChange={(e) => setLastName(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Contact Number <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    name="Contact Number"
                                                                    className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={contact_number}
                                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Email <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full mb-2">
                                                        <label
                                                            htmlFor="gender-name"
                                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                        >
                                                            Gender <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="mt-1">
                                                            <select
                                                                id="gender-name"
                                                                name="gender-name"
                                                                autoComplete="gender-name"
                                                                required
                                                                value={gender}
                                                                onChange={(e) => setGender(e.target.value)}
                                                                className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                            >
                                                                <option value={"male"}>Male</option>
                                                                <option value={"female"}>Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                                        <div className="mb-2">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Username <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-2 rounded-md shadow-sm">
                                                                <input
                                                                    type="text"
                                                                    name="username"
                                                                    className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={userName}
                                                                    onChange={(e) => setUserName(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Birth Date <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative mt-2 rounded-md shadow-sm">
                                                                <input
                                                                    type="date"
                                                                    name="birth-date"
                                                                    className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={moment(birth_date).format("YYYY-MM-DD")}
                                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <label
                                                                htmlFor=""
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Password <span className="text-red-500">*</span>
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
                                                        <div className="">
                                                            <label
                                                                htmlFor="price"
                                                                className="block text-sm text-left font-medium leading-6 text-gray-900"
                                                            >
                                                                Re-type Password <span className="text-red-500">*</span>
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
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                                        <div className="">
                                                            <label
                                                                htmlFor="street-address"
                                                                className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                            >
                                                                Street/Barangay <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="street-address"
                                                                    id="street-address"
                                                                    autoComplete="street-address"
                                                                    value={street_name}
                                                                    onChange={(e) => setStreetName(e.target.value)}
                                                                    required
                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <label
                                                                htmlFor="city"
                                                                className="block  text-left text-sm font-medium leading-6 text-gray-900"
                                                            >
                                                                City <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="city"
                                                                    id="city"
                                                                    autoComplete="address-level2"
                                                                    value={city_name}
                                                                    onChange={(e) => setCityName(e.target.value)}
                                                                    required
                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <label
                                                                htmlFor="region"
                                                                className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                            >
                                                                State / Province <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="region"
                                                                    id="region"
                                                                    autoComplete="address-level1"
                                                                    value={province_name}
                                                                    onChange={(e) => setProvinceName(e.target.value)}
                                                                    required
                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <label
                                                                htmlFor="postal-code"
                                                                className="block text-left text-sm font-medium leading-6 text-gray-900"
                                                            >
                                                                ZIP / Postal code{" "}
                                                                <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="text"
                                                                    name="postal-code"
                                                                    id="postal-code"
                                                                    autoComplete="postal-code"
                                                                    value={zip_code}
                                                                    onChange={(e) => setZipCode(e.target.value)}
                                                                    pattern="[0-9]{4}"
                                                                    required
                                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {process.env.RECAPTCHA_SITE_KEY && (
                                                        <ReCAPTCHA
                                                            sitekey={process.env.RECAPTCHA_SITE_KEY}
                                                            onChange={(token) => setRecaptchaToken(token)}
                                                        />
                                                    )}

                                                    <div className="mb-4 mt-4 ">
                                                        <p className="text-neutral-500 text-[0.8rem] text-center">
                                                            By creating this account, you acknowledge that you have
                                                            read, understood, agree to these{" "}
                                                            <Link
                                                                href="/terms-and-conditions"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Terms And Conditions.
                                                            </Link>
                                                        </p>
                                                    </div>
                                                    {isError && (
                                                        <div className="p-2 mt-1 bg-red-500 text-white text-xs rounded">
                                                            {error}
                                                        </div>
                                                    )}
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
                                                    "Register"
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
            <MessageModal open={showMessage} setOpen={setShowMessage} message={message} header={header} />
        </>
    );
}
