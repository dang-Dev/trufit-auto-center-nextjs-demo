"use client";

import { useState, useEffect, Fragment } from "react";
import { LineChart } from "./LineChart";
import moment from "moment";

function getTwoDatesBetweenDates(start: moment.Moment, end: moment.Moment) {
    const now = start.clone();
    let getDates = [];

    while (now.isSameOrBefore(end)) {
        getDates.push(now.format("ll"));
        now.add(1, "days");
    }
    return getDates;
}
type appointmentType = { createdAt: string; status: string };

export default function DashboardPage() {
    const [labels, setLabels] = useState<string[]>([]);
    const [appointments, setAppointments] = useState<appointmentType[]>([]);
    const [active, setActive] = useState("");
    const [pending, setPending] = useState(0);
    const [ongoing, setOngoing] = useState(0);
    const [expired, setExpired] = useState(0);
    const [done, setDone] = useState(0);

    async function fetchData(start_date: string, end_date: string) {
        const res = await fetch(`${process.env.BASE_PATH}/api/appointment`, {
            method: "POST",
            body: JSON.stringify({
                start_date: start_date,
                end_date: end_date,
            }),
            headers: { "Content-Type": "application/json" },
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    }

    const handleChangeFilter = async (data: string) => {
        const today = moment();
        switch (data) {
            case "7D": {
                const last_seven_days = moment(today).subtract(7, "days");
                const dates = getTwoDatesBetweenDates(last_seven_days, today);
                const filter_appointment = await fetchData(
                    last_seven_days.format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
                break;
            }
            case "15D": {
                const last_fifteen_days = moment(today).subtract(15, "days");
                const dates = getTwoDatesBetweenDates(last_fifteen_days, today);
                const filter_appointment = await fetchData(
                    last_fifteen_days.format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
                break;
            }
            case "30D": {
                const last_one_month = moment(today).subtract(1, "months");
                const dates = getTwoDatesBetweenDates(last_one_month, today);
                const filter_appointment = await fetchData(
                    last_one_month.format("YYYY-MM-DD"),
                    today.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
                break;
            }
            case "+7D": {
                const ahead_seven_days = moment(today).add(7, "days");
                const dates = getTwoDatesBetweenDates(today, ahead_seven_days);
                const filter_appointment = await fetchData(
                    today.format("YYYY-MM-DD"),
                    ahead_seven_days.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
               
                break;
            }
            case "+15D": {
                const ahead_fifteen_days = moment(today).add(15, "days");
                const dates = getTwoDatesBetweenDates(today, ahead_fifteen_days);
                const filter_appointment = await fetchData(
                    today.format("YYYY-MM-DD"),
                    ahead_fifteen_days.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
                break;
            }
            case "+30D": {
                const ahead_one_month = moment(today).add(1, "months");
                const dates = getTwoDatesBetweenDates(today, ahead_one_month);
                const filter_appointment = await fetchData(
                    today.format("YYYY-MM-DD"),
                    ahead_one_month.format("YYYY-MM-DD")
                );
                setAppointments(filter_appointment.data);
                setLabels(dates);
                setActive(data);
                break;
            }
            default:
                break;
        }
    };

    const countAppointment = async (status: string) => {
        const res = await fetch(`${process.env.BASE_PATH}/api/appointment/count`, {
            method: "POST",
            body: JSON.stringify({
                status: status,
            }),
            headers: { "Content-Type": "application/json" },
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const result = await res.json();
        switch (status) {
            case "PENDING":
                setPending(result.data);
                break;
            case "ONGOING":
                setOngoing(result.data);
                break;
            case "EXPIRED":
                setExpired(result.data);
                break;
            case "DONE":
                setDone(result.data);
                break;
        }
    };

    useEffect(() => {
        handleChangeFilter("+7D");
        countAppointment("PENDING");
        countAppointment("ONGOING");
        countAppointment("EXPIRED");
        countAppointment("DONE");
    }, []);

    return (
        <Fragment>
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-neutral-100 p-6 rounded-md shadow-lg hover:bg-slate-500 hover:text-white">
                    <div className="sm:text-sm sm:font-medium">PENDING APPOINTMENTS</div>
                    <div className="text-4xl mt-4">{pending}</div>
                </div>
                <div className="bg-neutral-100 p-6 rounded-md shadow-lg  hover:bg-slate-500 hover:text-white">
                    <div className="sm:text-sm sm:font-medium">ONGOING APPOINTMENTS</div>
                    <div className="text-4xl mt-4">{ongoing}</div>
                </div>
                <div className="bg-neutral-100 p-6 rounded-md shadow-lg  hover:bg-slate-500 hover:text-white">
                    <div className="sm:text-sm sm:font-medium">EXPIRED APPOINTMENTS</div>
                    <div className="text-4xl mt-4">{expired}</div>
                </div>
                <div className="bg-neutral-100 p-6 rounded-md shadow-lg  hover:bg-slate-500 hover:text-white">
                    <div className="sm:text-sm sm:font-medium">DONE APPOINTMENTS</div>
                    <div className="text-4xl mt-4">{done}</div>
                </div>
            </div>
            <div className="bg-neutral-100 p-6 rounded-md shadow-xl">
                <div className="mb-4 flex justify-between items-center">
                    <div className="text-neutral-600 sm:flex ">
                        <div className="sm:me-2">Total Appointment</div>
                        <div className="text-2xl ps-1 font-semibold">{appointments.length}</div>
                    </div>
                    <div className="space-x-2 sm:hidden xsm:hidden md:block lg:block xl:block">
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "+7D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("+7D")}
                        >
                            Next Week
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "+15D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("+15D")}
                        >
                            Next 2 Weeks
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "+30D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("+30D")}
                        >
                            Next Month
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "7D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("7D")}
                        >
                            Last Week
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "15D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("15D")}
                        >
                            Last 2 Weeks
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${
                                active === "30D" ? "bg-slate-700" : "bg-slate-500"
                            } text-white hover:bg-slate-700 text-sm`}
                            onClick={() => handleChangeFilter("30D")}
                        >
                            Last Month
                        </button>
                    </div>
                </div>
                <LineChart labels={labels} appointments={appointments} />
            </div>
        </Fragment>
    );
}
