import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <section className="relative mt-8">
            <div className="container mx-auto mb-16 pl-[2%] pr-[2%]">
                <div className="flex lg:flex-row flex-col">
                    <div className="basis-1/2">
                        <div className="text-2xl lg:text-4xl font-bold text-red-500">
                            <Link href={"#home"}>TRUFIT AUTO CENTER</Link>
                        </div>
                        <div className="text-neutral-700 mt-4 lg:mt-8">1042 Vinzons Ave. P-1 Brgy. Gahonon,</div>
                        <div className="text-neutral-700">Daet, Philippines</div>
                        <div className="text-neutral-700 mt-6">
                            <strong>Phone:</strong>
                            <span>+63918 774 7788</span>
                        </div>
                        <div className="text-neutral-700 mb-6">
                            <strong>Email:</strong>
                            <span>trufitautocenter@gmail.com</span>
                        </div>
                        <div className="text-neutral-700">Social Links</div>
                        <Link href={'https://www.facebook.com/TrufitAutoCenter'} className="">
                            <Image src={'/images/fb.png'} width={32} height={32} alt="Facebook Logo" />
                        </Link>
                    </div>
                    <div className="basis-1/4 mt-8 lg:mt-0">
                        <div className="text-xl font-bold text-red-500 mb-2">Our Services</div>
                        <ul className="list-disc list-inside marker:text-red-400">
                            <li className="mb-2">Diagnostic of Vehicle Electronics</li>
                            <li className="mb-2">Maintenance and Inspection</li>
                            <li className="mb-2">Air-conditioning Services & Repair</li>
                            <li className="mb-2">Mechanical Repair</li>
                            <li className="mb-2">Under chassis Repair</li>
                            <li className="mb-2">Diesel Vehicle Services</li>
                            <li className="mb-2">Interior & Exterior Detailing</li>
                        </ul>
                    </div>
                    <div className="basis-1/4 mt-8 lg:mt-0">
                        <div className="text-xl font-bold text-red-500 mb-2">Service Areas</div>
                        <ul className="list-disc list-inside marker:text-red-400">
                            <li className="mb-2">Daet, Philippines</li>
                            <li className="mb-2">Alawihao, Philippines</li>
                            <li className="mb-2">San Vicente, Philippines</li>
                            <li className="mb-2">Labo, Philippines</li>
                            <li className="mb-2">Capalonga, Philippines</li>
                            <li className="mb-2">Talisay, Philippines</li>
                            <li className="mb-2">Paracale, Philippines</li>
                            <li className="mb-2">Jose Panganiban, Philippines</li>
                            <li className="mb-2">Vinzons, Philippines</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-red-200 pt-5 pb-5">
                <div className="container mx-auto pl-[2%] pr-[2%]">
                    <div className="text-sm text-neutral-700 text-center lg:text-left">
                        © Copyright Trufit Auto Center. All Rights Reserved
                    </div>
                </div>
            </div>
        </section>
    );
}
