"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppointmentData } from "@/type";
import { toast } from "react-toastify";

export default function AppointmentEditForm({
    data,
    notificationId,
}: {
    data: AppointmentData;
    notificationId: string;
}) {
    const router = useRouter();
    const [car_brand, setCarBrand] = useState(data.carBrand);
    const [plate_number, setPlateNumber] = useState(data.plateNumber);
    const [car_issue, setCarIssue] = useState(data.carIssue);
    const [status, setStatus] = useState(data.status);
    const [vehicle_model, setVehicleModel] = useState(data.vehicleModel);
    const [mileage, setMileage] = useState(data.mileage);
    const [chassis_number, setChassisNumber] = useState(data.chassisNumber);
    const [engine_number, setEngineNumber] = useState(data.engineNumber);
    const [remarks, setRemarks] = useState(data.remark ?? "");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [walked_in_full_name, setWalkedInFullName] = useState(data.walkedInFullName);

    const handleStatusChange = (e: string) => {
        setStatus(e);
    };

    useEffect(() => {
        const updateNotification = async () => {
            const result = await fetch("/api/notification/update_unread", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notificationId,
                }),
            });

            if (!result.ok) {
                throw new Error("Failed Fetching data.");
            }
            const { data } = await result.json();
            console.log(data);
        };
        updateNotification();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/appointment/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walkedInFullName: walked_in_full_name,
                    carBrand: car_brand,
                    plateNumber: plate_number,
                    carIssue: car_issue,
                    remark: remarks,
                    chassisNumber: chassis_number,
                    engineNumber: engine_number,
                    status,
                    isWalkedIn: data.isWalkedIn,
                }),
            });

            if (res.status !== 200) {
                throw new Error("Something went wrong!");
            }
            toast.success("Edited successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            router.push("/admin/appointment");
        } catch (error: any) {
            setErrorMessage(error.message);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-4 border-b border-gray-900/10 pb-12">
                <h2 className="text-xl font-semibold leading-7 text-gray-900">Appointment Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Please review carefully before submitting the data.
                </p>

                <div className="mt-6">
                    {data.isWalkedIn ? (
                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Customer Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    name="customer-full-name"
                                    type="text"
                                    autoComplete="customer-full-name"
                                    value={walked_in_full_name}
                                    onChange={(e) => setWalkedInFullName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-md">
                                <strong>Customer Contact Number:</strong> {data.customer?.phoneNumber}
                            </h1>
                            <h1 className="text-md">
                                <strong>Customer email:</strong> {data.customer?.email}
                            </h1>
                            <h1 className="text-md">
                                <strong>Customer Full Name:</strong> {data.customer?.firstName}{" "}
                                {data.customer?.lastName}
                            </h1>
                        </>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="car-brand" className="block text-sm font-medium leading-6 text-gray-900">
                            Car Brand <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="car-brand"
                                id="car-brand"
                                autoComplete="car-brand"
                                value={car_brand}
                                onChange={(e) => setCarBrand(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="plate-number" className="block text-sm font-medium leading-6 text-gray-900">
                            Plate Number <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="plate-number"
                                id="plate-number"
                                autoComplete="plate-number"
                                value={plate_number}
                                onChange={(e) => setPlateNumber(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                            Car Issue
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="about"
                                name="about"
                                value={car_issue}
                                onChange={(e) => setCarIssue(e.target.value)}
                                rows={4}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                        {/* <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p> */}
                    </div>
                    <div className="sm:col-span-full"></div>
                    <div className="sm:col-span-3">
                        <label htmlFor="vehicle-model" className="block text-sm font-medium leading-6 text-gray-900">
                            Vehicle Model <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="vehicle-model"
                                id="vehicle-model"
                                autoComplete="vehicle-model"
                                value={vehicle_model}
                                onChange={(e) => setVehicleModel(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="mileage" className="block text-sm font-medium leading-6 text-gray-900">
                            Mileage <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="mileage"
                                id="mileage"
                                autoComplete="mileage"
                                value={mileage}
                                onChange={(e) => setMileage(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="chassis_number" className="block text-sm font-medium leading-6 text-gray-900">
                            Chassis Number
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="chassis_number"
                                id="chassis_number"
                                autoComplete="chassis-number"
                                value={chassis_number}
                                onChange={(e) => setChassisNumber(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="engine_number" className="block text-sm font-medium leading-6 text-gray-900">
                            Engine Number
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="engine_number"
                                id="engine_number"
                                autoComplete="engine-number"
                                value={engine_number}
                                onChange={(e) => setEngineNumber(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {/* <div className="sm:col-span-4">
                        <label htmlFor="customer-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                id="customer-name"
                                name="customer-name"
                                type="text"
                                autoComplete="customer-name"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div> */}

                    <div className="sm:col-span-3">
                        <label htmlFor="remarks" className="block text-sm font-medium leading-6 text-gray-900">
                            Remarks <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                name="remarks"
                                type="text"
                                autoComplete="remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-full">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                Appointment Status:
                            </legend>
                            {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                                    These are delivered via SMS to your mobile phone.
                                </p> */}
                            <div className="flex mt-2 gap-3">
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-pending"
                                        name="status"
                                        type="radio"
                                        checked={status === "PENDING"}
                                        onChange={() => handleStatusChange("PENDING")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-pending"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-gray-700"
                                    >
                                        PENDING
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-approved"
                                        name="status"
                                        type="radio"
                                        checked={status === "APPROVED"}
                                        onChange={() => handleStatusChange("APPROVED")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-approved"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-fuchsia-600"
                                    >
                                        APPROVED
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-disapproved"
                                        name="status"
                                        type="radio"
                                        checked={status === "DISAPPROVED"}
                                        onChange={() => handleStatusChange("DISAPPROVED")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-disapproved"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-orange-600"
                                    >
                                        DISAPPROVED
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-ongoing"
                                        name="status"
                                        type="radio"
                                        checked={status === "ONGOING"}
                                        onChange={() => handleStatusChange("ONGOING")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-ongoing"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-blue-900"
                                    >
                                        ONGOING
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-expired"
                                        name="status"
                                        type="radio"
                                        checked={status === "EXPIRED"}
                                        onChange={() => handleStatusChange("EXPIRED")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-expired"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-red-900"
                                    >
                                        EXPIRED
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-canceled"
                                        name="status"
                                        type="radio"
                                        checked={status === "CANCELED"}
                                        onChange={() => handleStatusChange("CANCELED")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-expired"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-yellow-500"
                                    >
                                        CANCELED
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="status-done"
                                        name="status"
                                        type="radio"
                                        checked={status === "DONE"}
                                        onChange={() => handleStatusChange("DONE")}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label
                                        htmlFor="status-done"
                                        className="block whitespace-nowrap text-sm font-medium leading-6 text-green-600"
                                    >
                                        DONE
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
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
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}
