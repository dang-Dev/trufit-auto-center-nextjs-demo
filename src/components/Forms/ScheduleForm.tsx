"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import MessageModal from "../Modal/MessageModal";
import { EventData } from "@/type";
import moment from "moment";
import { toast } from "react-toastify";


export default function ScheduleForm({ session, scheduleList }: { session: any; scheduleList: EventData[] }) {
    const [car_brand, setCarBrand] = useState("");
    const [plate_number, setPlateNumber] = useState("");
    const [car_issue, setCarIssue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");
    const [vehicle_model, setVehicleModel] = useState("");
    const [mileage, setMileage] = useState("");
    const [chassis_number, setChassisNumber] = useState("");
    const [engine_number, setEngineNumber] = useState("");
    const [selected_event_id, setSelectedEventId] = useState("");
    const [schedule_list, setScheduleList] = useState(scheduleList);

    async function getAvailableSchedule() {
        try {
            const startOfDay = new Date();
            startOfDay.setUTCHours(0, 0, 0, 0);
            const res = await fetch(`${process.env.BASE_PATH}/api/event?start=${startOfDay.toISOString()}`, {
                cache: "no-store",
            });
            if (!res.ok) {
                throw new Error("Failed Fetching data.");
            }
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!session) {
            console.log("Login is required!");
            alert("Please Create or Register Account first before you can use this feature. Thank you.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    car_brand,
                    plate_number,
                    vehicle_model,
                    mileage,
                    car_issue,
                    chassis_number,
                    engine_number,
                    customer_id: session.user.id,
                    event_id: selected_event_id,
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
                setShowMessage(true);
                setMessage("Your Appointment was successfully set.");
                setHeader("Great, Thank you.");
              
                const events = await getAvailableSchedule();
                setScheduleList(events.data);
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
    }
   

    return (
        <>
            <form action="" method="post" onSubmit={onSubmit}>
                <div className="mb-1 mt-3">
                    <input
                        type="text"
                        name="car-brand"
                        className="w-full px-2 py-2 appearance-none rounded border-2  border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Car Brand"
                        value={car_brand}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCarBrand(e.currentTarget.value)}
                        required
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="text"
                        name="plate-number"
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Car Plate Number"
                        value={plate_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlateNumber(e.currentTarget.value)}
                        required
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="text"
                        name="vehicle-model"
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Vehicle Model"
                        value={vehicle_model}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVehicleModel(e.currentTarget.value)}
                        required
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="text"
                        name="mileage"
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Mileage"
                        value={mileage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMileage(e.currentTarget.value)}
                        required
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="text"
                        name="chassis_number"
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Chassis Number"
                        value={chassis_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChassisNumber(e.currentTarget.value)}
                    />
                </div>
                <div className="mb-1">
                    <input
                        type="text"
                        name="engine_number"
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Engine Number"
                        value={engine_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEngineNumber(e.currentTarget.value)}
                    />
                </div>
                <div className="mb-1">
                    <textarea
                        id="message"
                        rows={4}
                        className="w-full px-2 py-2 appearance-none rounded border-2 border-white focus:outline-none focus:bg-white focus:border-red-400"
                        placeholder="Write here what happened to your car..."
                        value={car_issue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCarIssue(e.currentTarget.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-2 text-left">
                    <label htmlFor="" className="text-sm text-neutral-500 mb-1">
                        Pick a preferred Schedule
                    </label>
                    <select
                        id="event"
                        name="event"
                        autoComplete="event"
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        value={selected_event_id}
                        required
                        className="block w-full px-1 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option defaultValue="" value="">
                            Please select...
                        </option>
                        {schedule_list.map((item) => (
                            <option
                                key={item.id}
                                value={`${item.id}`}
                                disabled={
                                    item.appointments.filter(
                                        (item) => item.status === "APPROVED" || item.status === "ONGOING"
                                    ).length === item.allowed
                                }
                            >
                                {moment(item.start).format("lll")}-{moment(item.end).format("lll")} |{" "}
                                {
                                    item.appointments.filter(
                                        (item) => item.status === "APPROVED" || item.status === "ONGOING"
                                    ).length
                                }
                                /{item.allowed} slot{" "}
                                {item.appointments.filter(
                                    (item) => item.status === "APPROVED" || item.status === "ONGOING"
                                ).length === item.allowed && "- FULL"}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full text-center first-line:pointer-events-auto rounded bg-[#FF545F] px-2 py-2.5 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-300"
                >
                    {isLoading ? (
                        <Image src={"/images/Spin.gif"} className="mx-auto" width={24} height={24} alt="Loading" />
                    ) : (
                        "SUBMIT FORM"
                    )}
                </button>
            </form>
            <MessageModal open={showMessage} setOpen={setShowMessage} message={message} header={header} />
        </>
    );
}
