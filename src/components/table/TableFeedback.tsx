"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import moment from "moment";

export default function TableFeedback({ slug }: { slug: string }) {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const itemsPerPage = 10;
    const [pageCount, setPageCount] = useState(Math.ceil(total / itemsPerPage));
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const getFeedbacks = async () => {
            try {
                const res = await fetch(`${process.env.BASE_PATH}/api/feedback?limit=10`, { cache: "no-cache" });
                if (!res.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const feedbacks = await res.json();
                setList(feedbacks.data);
                setTotal(feedbacks.total);
            } catch (error) {
                console.log(error);
            }
        };
        getFeedbacks();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm(`Are you sure to delete '${id}'?`)) {
            try {
                const res = await fetch(`/api/feedback`, {
                    method: "DELETE",
                    body: JSON.stringify({
                        uuid: id,
                    }),
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

                const res1 = await fetch(`${process.env.BASE_PATH}/api/feedback?limit=10`, { cache: "no-cache" });
                if (!res1.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const feedbacks = await res1.json();
                setList(feedbacks.data);
                setItemOffset(0);
            } catch (error: any) {
                console.log(error.message);
            }
        }
    };

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        const res = await fetch(`${process.env.BASE_PATH}/api/feedback?offset=${newOffset}&limit=${itemsPerPage}`, {
            cache: "no-cache",
        });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        const new_list = await res.json();
        setList(new_list.data);
        setItemOffset(newOffset);
    };

    return (
        <>
            <div className="overflow-auto max-h-[72vh]">
                <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                First Name
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Last Name
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Feedback
                            </th>
                            <th scope="col" className="px-6 py-4">
                                CreateAt
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
                                <td className="whitespace-nowrap px-6 py-4">{item.user.firstName}</td>
                                <td className="whitespace-nowrap px-6 py-4">{item.user.lastName}</td>
                                <td className="whitespace-nowrap px-6 py-4">{item.feedback}</td>
                                <td className="whitespace-nowrap px-6 py-4">{moment(item.created_at).format("LLL")}</td>
                                <td className="text-center">
                                    {/* <Link href={`/admin/${slug}/send-notification/${item.id}`} className=" me-1">
                                    <EnvelopeIcon className="h-6 w-6 text-gray-500 inline-block" />
                                </Link>
                                <Link href={`/admin/${slug}/${item.id}`}>
                                    <PencilSquareIcon className="h-6 w-6 text-blue-500 inline-block" />
                                </Link> */}
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
        </>
    );
}
