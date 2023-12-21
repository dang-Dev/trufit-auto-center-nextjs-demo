import Link from "next/link";
import Image from "next/image";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import ScheduleForm from "./Forms/ScheduleForm";
import homeImage from "../../public/images/main-pic2.jpg";

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
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function HomePage({ session }: { session: any }) {
    const { data } = await getAvailableSchedule();

    return (
        <section
            className="relative bg-[url('/images/store-picture.png')] bg-no-repeat bg-contain min-h-screen overflow-hidden pb-10"
            id="home"
        >
            <div className="absolute bg-white opacity-5 w-[32rem] h-[32rem] rounded-3xl -left-2 -top-2 rotate-45 z-0"></div>
            <div className="absolute bg-white opacity-5 w-[13rem] h-[13rem] rounded-3xl left-96 bottom-14 rotate-45 z-0"></div>
            <div className="absolute bg-white opacity-5 w-[20rem] h-[20rem] rounded-3xl right-[32rem] top-2 rotate-45 z-0"></div>

            <div className="container mx-auto relative lg:h-screen flex content-center pl-[2%] pr-[2%]">
                <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:place-items-center">
                    <div className="w-full lg:pr-10">
                        <h1 className="text-white text-center mt-10 sm:mt-10 pb-4 text-4xl lg:text-4xl lg:leading-[4rem] xl:text-4xl xl:leading-[3rem] lg:text-left xl:text-left font-bold lg:outline-1 lg:outline-red-700">
                            Quality Care, Seamless Repairs, Endless Journeys.
                        </h1>
                        <div className="lg:mt-6 text-center lg:text-left xl:text-left">
                            <Link
                                href={"#services"}
                                className="inline-flex items-center rounded bg-[#FF545F] px-6 pb-1.5 pt-1.5 text-sm lg:text-base lg:py-2 uppercase leading-normal text-white hover:shadow-md hover:shadow-blue-100"
                            >
                                See Services <ArrowLongRightIcon className=" w-6 ml-2 text-white inline-block" />
                            </Link>
                        </div>
                    </div>
                    {session && (
                        <div className="w-full">
                            <div className="mt-14 mb-6 sm:mt-14 bg-[#f7eeee] lg:w-[26rem] mx-auto p-3 lg:p-3 rounded-lg text-center">
                                <div className="text-[#E22547] text-1xl uppercase font-semibold">
                                    Book Free Reservation Schedule{" "}
                                </div>
                                <div className="text-sm mt-6 lg:mt-4 text-neutral-500">
                                    Please fill out the form below.
                                </div>

                                <div className="lg:w-[24rem] mx-auto p-2">
                                    <ScheduleForm session={session} scheduleList={data} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
