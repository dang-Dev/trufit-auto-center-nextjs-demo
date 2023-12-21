"use client";

import { Fragment, useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import moment from "moment";
import StatusTag from "../StatusTag";
import { AppointmentData } from "@/type";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

type TableData = {
    appointments: AppointmentData[];
    slug: string;
    total: number;
};

export default function Table({ appointments, slug, total }: TableData) {
    const itemsPerPage = 10;
    const [list, setList] = useState(appointments);
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(Math.ceil(total / itemsPerPage));
    const [totalNew, setTotal] = useState(total);
    const [selected, setSelected] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        const res = await fetch(`${process.env.BASE_PATH}/api/appointment?offset=${newOffset}&limit=${itemsPerPage}`, {
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const new_list = await res.json();
        setList(new_list.data);
        setItemOffset(newOffset);
    };

    const handleOnChange = async (update: [Date | null, Date | null]) => {
        setDateRange(update);
        if (update[0] && update[1]) {
            const res = await fetch(
                `${process.env.BASE_PATH}/api/appointment?start-date=${update[0]}&end-date=${update[1]}&status=${selected}&limit=${itemsPerPage}`,
                {
                    cache: "no-cache",
                }
            );
            if (!res.ok) {
                throw new Error("Failed Fetching data.");
            }
            const new_list = await res.json();
            setList(new_list.data);
            setItemOffset(0);
            setTotal(new_list.total);
            setPageCount(Math.ceil(new_list.total / itemsPerPage));
        }
    };

    const fetchData = async () => {
        const res = await fetch(
            `${process.env.BASE_PATH}/api/appointment?start-date=${dateRange[0] ?? ""}&end-date=${
                dateRange[1] ?? ""
            }&status=${selected}&limit=${itemsPerPage}`,
            {
                cache: "no-cache",
            }
        );
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const new_list = await res.json();
        setList(new_list.data);
        setItemOffset(0);
        setPageCount(Math.ceil(new_list.total / itemsPerPage));
        setTotal(new_list.total);
    };

    useEffect(() => {
        if (dateRange[0] === null && dateRange[1] === null) {
            fetchData();
        }
    }, [dateRange]);

    const manageStatus = async (status: string, id: string, customerId: string) => {
        if (confirm(`Are you sure you want to ${status} selected appointment?`)) {
            try {
                const res = await fetch(`/api/appointment/manage-status`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id,
                        status,
                        customerId
                    }),
                });
                if (res.status !== 200) {
                    throw new Error("Something went wrong!");
                }
                toast.success(status, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                fetchData();
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm(`Are you sure to delete '${id}'?`)) {
            try {
                const res = await fetch(`/api/appointment/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.status !== 200) {
                    throw new Error("Something went wrong!");
                }
                toast.success("Delete Appointment record Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                fetchData();
                // router.push("/admin/appointment");
            } catch (error: any) {
                console.log(error.message);
            }
        }
    };

    const handleSelected = async (value: string) => {
        setSelected(value);
        let url = "";
        if (value !== "ALL") {
            url = `${process.env.BASE_PATH}/api/appointment?start-date=${dateRange[0] ?? ""}&end-date=${
                dateRange[1] ?? ""
            }&status=${value}&limit=${itemsPerPage}`;
        } else {
            url = `${process.env.BASE_PATH}/api/appointment?start-date=${dateRange[0] ?? ""}&end-date=${
                dateRange[1] ?? ""
            }&limit=${itemsPerPage}`;
        }
        const res = await fetch(url, {
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const new_list = await res.json();
        setList(new_list.data);
        setItemOffset(0);
        setPageCount(Math.ceil(new_list.total / itemsPerPage));
        setTotal(new_list.total);
    };

    return (
        <Fragment>
            <div className="flex justify-between px-4 mt-2 mb-4">
                <span className="text-xl font-semibold">Appointment Table</span>
                <div className="flex gap-3">
                    <div className="flex gap-2 items-center">
                        <span className="">Date:</span>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => handleOnChange(update)}
                            isClearable={true}
                            placeholderText="Select Date Range"
                            className="px-2 py-1.5 rounded text-neutral-900 inline-block"
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 ">
                            Status:
                        </label>
                        <div className="">
                            <select
                                id="status"
                                name="status"
                                autoComplete="status"
                                onChange={(e) => handleSelected(e.target.value)}
                                defaultValue={"ALL"}
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value={"ALL"}>ALL</option>
                                <option value={"PENDING"}>PENDING</option>
                                <option value={"ONGOING"}>ONGOING</option>
                                <option value={"EXPIRED"}>EXPIRED</option>
                                <option value={"DONE"}>DONE</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <a
                            href={`/admin/${slug}/print?start_date=${dateRange[0] ?? ""}&end_date=${
                                dateRange[1] ?? ""
                            }&status=${selected ?? ""}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-600 rounded text-white px-4 py-1"
                        >
                            PRINT
                        </a>
                    </div>
                    <div className="flex items-center">
                        <a
                            href={`/admin/${slug}/new-appointment`}
                            className="bg-green-600 rounded text-white px-4 py-1"
                        >
                            ADD
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-auto max-h-[72vh]">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Car Brand
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Plate Number
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Car Issue
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Vehicle Model
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Mileage
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Chassis Number
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Engine Number
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Appointment Date
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Remarks
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    status
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Walked-In
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    CreateAt
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    ExpiredAt
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {item.isWalkedIn
                                            ? item.walkedInFullName
                                            : `${item.customer.firstName} ${item.customer.lastName}`}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.carBrand}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.plateNumber}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.carIssue}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.vehicleModel}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.mileage}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.chassisNumber}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.engineNumber}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {moment(item.event.start).format("LLL")} -{" "}
                                        {moment(item.event.end).format("LLL")}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.remark ?? "No Remark Yet"}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StatusTag status={item.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span>{item.isWalkedIn ? "YES" : "NO"}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {moment(item.createdAt).format("LLL")}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {moment(item.expiredAt).format("LLL")}
                                    </td>
                                    <td className="text-center whitespace-nowrap">
                                        {item.status === "PENDING" && (
                                            <>
                                                <XCircleIcon
                                                    className="h-6 w-6 text-yellow-500 inline-block cursor-pointer"
                                                    title="Disapproved"
                                                    onClick={() =>
                                                        manageStatus("DISAPPROVED", item.id, item.customerId)
                                                    }
                                                />
                                                <CheckCircleIcon
                                                    className="h-6 w-6 text-green-500 inline-block cursor-pointer"
                                                    title="Approved"
                                                    onClick={() => manageStatus("APPROVED", item.id, item.customerId)}
                                                />
                                            </>
                                        )}

                                        <Link href={`/admin/${slug}/${item.id}`} className="">
                                            <PencilSquareIcon
                                                className="h-6 w-6 text-blue-500 inline-block"
                                                title="Edit"
                                            />
                                        </Link>
                                        <TrashIcon
                                            onClick={() => handleDelete(item.id)}
                                            className="h-6 w-6 inline-block text-red-600 cursor-pointer"
                                            title="Delete"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <a
                        href="#"
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </a>
                    <a
                        href="#"
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{itemOffset}</span> to{" "}
                            <span className="font-medium">{itemOffset + list.length}</span> of{" "}
                            <span className="font-medium">{totalNew}</span> results
                        </p>
                    </div>
                    <div>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel={<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />}
                            renderOnZeroPageCount={null}
                            activeClassName={"bg-indigo-600 text-white"}
                            previousClassName={
                                "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }
                            nextClassName={
                                "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }
                            containerClassName={"isolate inline-flex -space-x-px rounded-md shadow-sm"}
                            pageClassName={
                                "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
