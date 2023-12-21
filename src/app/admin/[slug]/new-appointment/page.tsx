"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import SpinnerImg from "../../../../../public/images/Spin.gif";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppointmentData } from "@/type";

type customerData = {
    id: string;
    firstName: string;
    lastName: string;
};

type scheduleData = {
    id: string;
    start: Date;
    end: Date;
    appointments: AppointmentData[]
    allowed: number;
};

export default function NewAppointment() {
    const router = useRouter();
    const [car_brand, setCarBrand] = useState("");
    const [plate_number, setPlateNumber] = useState("");
    const [car_issue, setCarIssue] = useState("");
    const [status, setStatus] = useState("APPROVED");
    const [vehicle_model, setVehicleModel] = useState("");
    const [mileage, setMileage] = useState("");
    const [chassis_number, setChassisNumber] = useState("");
    const [engine_number, setEngineNumber] = useState("");
    const [customers, setCustomers] = useState<customerData[]>([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [customer_type, setCustomerType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [schedule_list, setScheduleList] = useState<scheduleData[]>([]);
    const [selected_event_id, setSelectedEventId] = useState("");
    const [selected_customer_id, setSelectedCustomerId] = useState<string | null>(null);
    const [walked_in_full_name, setWalkedInFullName] = useState("");

    const handleStatusChange = (e: string) => {
        setStatus(e);
    };

    const handleChangeCustomerType = async (e: string) => {
        setCustomerType(e);
        if (e === "WITH_ACCOUNT") {
            try {
                const res = await fetch("/api/auth/user", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const resJson = await res.json();
                setCustomers(resJson.data);
            } catch (error) {
                console.error(error);
            }
        } else if (e === "WALKED_IN") {
            setWalkedInFullName("");
            setSelectedCustomerId(null)
        }
    };

    useEffect(() => {
        setCustomerType("WALKED_IN");
        async function getAvailableSchedule() {
            try {
                const startOfDay = new Date();
                startOfDay.setUTCHours(0, 0, 0, 0);
                const res = await fetch(`${process.env.BASE_PATH}/api/event?start=${startOfDay.toISOString()}`, {
                    cache: "no-cache",
                });
                if (!res.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const result = await res.json();
                setScheduleList(result.data);
            } catch (error) {
                console.log(error);
            }
        }
        getAvailableSchedule();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const res = await fetch("/api/appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    car_brand,
                    plate_number,
                    vehicle_model,
                    mileage,
                    chassis_number,
                    engine_number,
                    car_issue,
                    customer_id: selected_customer_id,
                    event_id: selected_event_id,
                    walked_in_full_name,
                    status
                }),
            });
            if (res.status === 201) {
                setCarBrand("");
                setPlateNumber("");
                setCarIssue("");
                setVehicleModel("");
                setMileage("");
                setChassisNumber("");
                setEngineNumber("");
                setSelectedEventId("");
                setSelectedCustomerId("");
                setWalkedInFullName("");
                toast.success("Appointment successfully Created", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                router.push("/admin/appointment");
            } else {
                res.json().then((e) => {
                    toast.error(e.error, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold leading-7 text-gray-900">Appointment Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Please review carefully before submitting the data.</p>

            <fieldset className="mt-3">
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Customer Type <span className="text-red-500">*</span>
                </legend>
                <div className="mt-1 space-y-2">
                    <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                            <input
                                name="customer-type"
                                type="radio"
                                value={"WALKED_IN"}
                                checked={customer_type === "WALKED_IN"}
                                onChange={(e) => handleChangeCustomerType(e.target.value)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                        </div>
                        <div className="text-sm leading-6">
                            <label htmlFor="comments" className="font-medium text-gray-900">
                                Walked-In Customer
                            </label>
                        </div>
                    </div>
                    <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                            <input
                                name="customer-type"
                                type="radio"
                                value={"WITH_ACCOUNT"}
                                checked={customer_type === "WITH_ACCOUNT"}
                                onChange={(e) => handleChangeCustomerType(e.target.value)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                        </div>
                        <div className="text-sm leading-6">
                            <label htmlFor="candidates" className="font-medium text-gray-900">
                                With Account Customer
                            </label>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                {customer_type === "WALKED_IN" && (
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
                )}

                {customer_type === "WITH_ACCOUNT" && (
                    <div className="sm:col-span-4">
                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                            Customer Account
                        </label>
                        <div className="mt-2">
                            <select
                                name="customer-account"
                                autoComplete="customer-account"
                                defaultValue={"selected"}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value={"selected"} disabled>
                                    Please Select Customer Account
                                </option>
                                {customers.map((ele) => (
                                    <option value={ele.id} key={ele.id}>
                                        {ele.firstName} {ele.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
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
                <div className="sm:col-span-4">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                        Available Appointment Schedule
                    </label>
                    <div className="mt-2">
                        <select
                            name="schedule"
                            autoComplete="schedule"
                            defaultValue={"selected"}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            <option value={"selected"} disabled>
                                Please Select Available Appointment Schedule
                            </option>
                            {schedule_list.map((item) => (
                                <option key={item.id} value={`${item.id}`}>
                                    {moment(item.start).format("lll")}-{moment(item.end).format("lll")} |{" "}
                                    {item.appointments.filter((item)=> item.status === "APPROVED").length}/{item.allowed} slot
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-full">
                    <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">Appointment Status:</legend>
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
                                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-600"
                                />
                                <label
                                    htmlFor="status-pending"
                                    className="block whitespace-nowrap text-sm font-medium leading-6 text-blue-700"
                                >
                                    APPROVED
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
                                    id="status-done"
                                    name="status"
                                    type="radio"
                                    checked={status === "DONE"}
                                    onChange={() => handleStatusChange("DONE")}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                    htmlFor="status-done"
                                    className="block whitespace-nowrap text-sm font-medium leading-6 text-green-900"
                                >
                                    DONE
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                {errorMessage && <div className="text-red-500 sm:col-span-6">* {errorMessage}</div>}
            </div>
            <div className="mt-6 flex items-center justify-start gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {isLoading ? (
                        <Image src={SpinnerImg} className="mx-auto" width={24} height={24} alt="Loading" />
                    ) : (
                        "Create Appointment"
                    )}
                </button>
            </div>
        </form>
    );
}
