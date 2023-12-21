"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { UserData } from "@/type";
import moment from "moment";
import { toast } from "react-toastify";

type UserData = {
    id: string;
    username: string | null;
    // password: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    birthDate: Date | null;
    gender: string | null;
    isEmailVerify: boolean;
    notifType: string;
    address: {
        street: string;
        city: string;
        province: string;
        zip_code: string;
    } | null;
} | null

export default function EditUserForm({ data, isAdmin }: { data: UserData ; isAdmin: boolean }) {
    const router = useRouter();
    const [username, setUserName] = useState(data?.username);
    const [first_name, setFirstName] = useState(data?.firstName);
    const [last_name, setLastName] = useState(data?.lastName);
    const [email, setEmail] = useState(data?.email);
    const [contact_number, setContactNumber] = useState(data?.phoneNumber);
    const [street_name, setStreetName] = useState(data?.address?.street);
    const [city_name, setCityName] = useState(data?.address?.city);
    const [province_name, setProvinceName] = useState(data?.address?.province);
    const [zip_code, setZipCode] = useState(data?.address?.zip_code);
    const [birth_date, setBirthDate] = useState(data?.birthDate);
    const [gender, setGender] = useState(data?.gender ?? null);
    const [isVerify, setIsVerify] = useState(data?.isEmailVerify);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/auth/user/${data?.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    contact_number: contact_number,
                    birth_date: birth_date,
                    gender: gender,
                    street_name: street_name,
                    city_name: city_name,
                    province_name: province_name,
                    zip_code: zip_code,
                    email_verified: isVerify,
                }),
            });

            if (res.status !== 200) {
                throw new Error("Something went wrong!");
            }
            toast.success(isAdmin?"Update User Successfully": "Profile Successfully updated", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            if(isAdmin){
                router.push("/admin/user");
            }else {
                router.push("/");
            }
            
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-medium">{isAdmin ? "UPDATE USER" : "Profile"}</h3>
            {isAdmin && (
                <div className="mt-8 border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
                    <p className="text-neutral-500 mt-2">Please fill out all the needed details below.</p>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2 ">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="username"
                                    autoComplete="username"
                                    value={username??''}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a personal email address where you can receive email form us.
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use active contact number to receive sms from us.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                value={first_name??''}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Last name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                value={last_name??""}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="gender-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <select
                                id="gender-name"
                                name="gender-name"
                                autoComplete="gender-name"
                                required
                                value={gender??''}
                                onChange={(e) => setGender(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value={"male"}>Male</option>
                                <option value={"female"}>Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="birth-date" className="block text-sm font-medium leading-6 text-gray-900">
                            BirthDate <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="birth-date"
                                autoComplete="birth-date"
                                value={moment(birth_date).format("YYYY-MM-DD")}
                                onChange={(e) => setBirthDate(new Date(e.target.value))}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email??''}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="Contact#" className="block text-sm font-medium leading-6 text-gray-900">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                name="contact-number"
                                type="text"
                                autoComplete="contact-number"
                                value={contact_number??''}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="eg: 0910*****21"
                                pattern="[0-9]{11}"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
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

                    <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
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

                    <div className="sm:col-span-2">
                        <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
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

                    <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                            ZIP / Postal code <span className="text-red-500">*</span>
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
                    {isAdmin && (
                        <div className="col-span-full">
                            <fieldset>
                                <legend className="text-sm font-semibold leading-6 text-gray-900">
                                    Email Verification Status:
                                </legend>
                                {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                                    These are delivered via SMS to your mobile phone.
                                </p> */}
                                <div className="flex mt-2 gap-3">
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="status-pending"
                                            name="status"
                                            type="checkBox"
                                            checked={isVerify}
                                            onChange={() => setIsVerify(!isVerify)}
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label
                                            htmlFor="status-pending"
                                            className="block whitespace-nowrap text-sm font-medium leading-6 text-gray-700"
                                        >
                                            {isVerify ? "VERIFIED" : "PENDING"}
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )}

                    {errorMessage && <div className="text-red-500 sm:col-span-6">* {errorMessage}</div>}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-start gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {isLoading ? (
                        <Image src={"/images/Spin.gif"} className="mx-auto" width={24} height={24} alt="Loading" />
                    ) : (
                        "Save"
                    )}
                </button>
            </div>
        </form>
    );
}
