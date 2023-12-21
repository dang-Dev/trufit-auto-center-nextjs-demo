"use client";

import { FormEvent, useState } from "react";
import { Session } from "next-auth";
import { toast } from "react-toastify";

export default function RateUs({ session }: { session: Session | null }) {
    const [feedback, setFeedback] = useState("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                feedback: feedback,
                uuid: session?.user?.id,
            }),
        });

        const data = await response.json();
        if(data){
            setFeedback("");
            toast.success("Feedback Successfully Send!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }else{
            setFeedback("");
            toast.error("Something went wrong!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    return (
        <section className="relative pl-[2%] pr-[2%] pt-[10%] pb-[10%] lg:pt-[5%] lg:pb-[5%] h-screen bg-[#FEFAF9]">
            <div className="text-center">
                <h1 className="text-lg lg:text-4xl underline underline-offset-4 lg:underline-offset-8 text-red-500 font-bold font-sans">
                    LEAVE FEEDBACK TO US
                </h1>
            </div>
            <div className="w-full lg:w-3/5 mx-auto bg-slate-300 rounded">
                <div className="col-span-full mt-5 p-5 lg:p-9">
                    <form onSubmit={onSubmit}>
                        <div className="mt-2">
                            <textarea
                                id="feedback"
                                name="feedback"
                                rows={4}
                                value={feedback}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFeedback(e.currentTarget.value)
                                }
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about you&apos;re feedback.
                        </p>
                        <button
                            type="submit"
                            className="bg-rose-500 px-3 py-1.5 text-white font-semibold mt-2 rounded hover:bg-rose-600"
                        >
                            Submit you&apos;re feedback
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
