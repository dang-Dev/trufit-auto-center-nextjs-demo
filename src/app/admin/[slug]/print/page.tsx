"use client";

type SearchParams = string | undefined | string[];

import { AppointmentData } from "@/type";
import moment from "moment";
import { useEffect, useState } from "react";

export default function PrintData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const [list, setList] = useState([]);
    const start_date = searchParams["start_date"];
    const end_date = searchParams["end_date"];
    const status = searchParams["status"];

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `${process.env.BASE_PATH}/api/appointment?start-date=${start_date ?? ""}&end-date=${
                    end_date ?? ""
                }&status=${status ?? ""}&is-print=true`,
                {
                    cache: "no-cache",
                }
            );
            if (!res.ok) {
                throw new Error("Failed Fetching data.");
            }
            const data = await res.json();
            setList(data.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (list.length > 0) {
            window.print();
        }
    }, [list]);

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h1>Appointment Record as of today {moment().format("LLL")}</h1>
            </div>
            <table
                style={{
                    border: "1px solid",
                    width: "100%",
                    padding: "5px",
                    fontSize: "10px",
                }}
            >
                <tbody>
                    <tr>
                        <th style={{ border: "1px solid", padding: "5px" }}>Customer</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Car Brand</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Plate#</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Vehicle Model</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Mileage</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Chassis Number</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Engine Number</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Appointment Date</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Status</th>
                        <th style={{ border: "1px solid", padding: "5px" }}>Remarks</th>
                    </tr>
                    {list.map((ele: AppointmentData) => (
                        <tr key={ele.id}>
                            <td style={{ padding: "5px", border: "1px solid" }}>
                                {ele.customer.firstName} {ele.customer.lastName}
                            </td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.carBrand}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.plateNumber}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.vehicleModel}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.mileage}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.chassisNumber}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.engineNumber}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>
                                {moment(ele.event.start).format("LLL")} - {moment(ele.event.end).format("LLL")}
                            </td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.status}</td>
                            <td style={{ padding: "5px", border: "1px solid" }}>{ele.remark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
