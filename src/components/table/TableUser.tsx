"use client";

import { Fragment, useState } from "react";
import { PencilSquareIcon, EnvelopeIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserData } from "@/type";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

type TableData = {
    users: UserData[];
    slug: string;
    total: number;
};

export default function TableUser({ users, slug, total }: TableData) {
    const [list, setList] = useState(users);
    const itemsPerPage = 10;
    const [pageCount, setPageCount] = useState(Math.ceil(total / itemsPerPage));
    const [itemOffset, setItemOffset] = useState(0);
    const [selected_ids, setSelectedIds] = useState<string[]>([]);

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        const res = await fetch(`${process.env.BASE_PATH}/api/users?offset=${newOffset}&limit=${itemsPerPage}`, {
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const new_list = await res.json();
        setList(new_list.data);
        setItemOffset(newOffset);
    };

    const handleCheckBoxSelect = (current_id: string, checked: boolean) => {
        if (checked && !selected_ids.includes(current_id)) {
            setSelectedIds([...selected_ids, current_id]);
            window.sessionStorage.setItem("selected_ids", [...selected_ids, current_id].toString());
        } else {
            const n = selected_ids.indexOf(current_id);
            const _arr = selected_ids;
            _arr.splice(n, 1);
            setSelectedIds([..._arr]);
            window.sessionStorage.setItem("selected_ids", [..._arr].toString());
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm(`Are you sure to delete '${id}'?`)) {
            try {
                const res = await fetch(`/api/auth/user/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.status !== 200) {
                    throw new Error("Something went wrong!");
                }
                toast.success("Delete User Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                const res1 = await fetch(`${process.env.BASE_PATH}/api/auth/user?limit=10`, { cache: "no-cache" });
                if (!res1.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const new_list = await res1.json();
                setList(new_list.data);
                setItemOffset(0);
            } catch (error: any) {
                console.log(error.message);
            }
        }
    };

    const handleCheckAll = (checked: boolean) => {
        let ids: string[] = [];
        if(checked){
            list.forEach(element => {
                const checkBox = document.getElementById(element.id) as HTMLInputElement | null;
                if(checkBox){
                    checkBox.checked = true;
                    ids.push(element.id)
                }
            });
            setSelectedIds(ids);
            window.sessionStorage.setItem("selected_ids", ids.toString());
        }else{
            list.forEach(element => {
                const checkBox = document.getElementById(element.id) as HTMLInputElement | null;
                if(checkBox){
                    checkBox.checked = false;
                }
            });
            setSelectedIds(ids);
            window.sessionStorage.setItem("selected_ids", ids.toString());
        }
    }
    
    return (
        <Fragment>
            {selected_ids.length > 0 && (
                <Link
                    href={`/admin/${slug}/bulk-send-notification`}
                    className="ms-3 mb-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    ({selected_ids.length}) Bulk Send Notification
                </Link>
            )}
            <div className="flex flex-col">
                <div className="overflow-auto max-h-[72vh]">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    <div className="flex h-6 items-center">
                                        <input
                                            name="user-id"
                                            type="checkbox"
                                            onChange={(e) => handleCheckAll(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    First Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Last Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Contact#
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Verified
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
                                        <div className="flex h-6 items-center">
                                            <input
                                                id={item.id}
                                                name="user-id"
                                                type="checkbox"
                                                onChange={(e) => handleCheckBoxSelect(item.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.firstName}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.lastName}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.username}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.phoneNumber}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {EmailVerificationStatus(item.isEmailVerify ? "VERIFIED" : "PENDING")}
                                    </td>
                                    <td className="text-center">
                                        <Link href={`/admin/${slug}/send-notification/${item.id}`} className=" me-1">
                                            <EnvelopeIcon className="h-6 w-6 text-gray-500 inline-block" />
                                        </Link>
                                        <Link href={`/admin/${slug}/${item.id}`}>
                                            <PencilSquareIcon className="h-6 w-6 text-blue-500 inline-block" />
                                        </Link>
                                        <TrashIcon
                                            onClick={() => handleDelete(item.id)}
                                            className="h-6 w-6 inline-block text-red-600 cursor-pointer"
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
                <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{itemOffset}</span> to{" "}
                            <span className="font-medium">{itemOffset + list.length}</span> of{" "}
                            <span className="font-medium">{total}</span> results
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
function EmailVerificationStatus(status: string) {
    return (
        <span
            className={`px-2 py-1 rounded-full ${
                status === "VERIFIED" ? "bg-green-600" : "bg-blue-600"
            } text-xs text-white`}
        >
            {status}
        </span>
    );
}
