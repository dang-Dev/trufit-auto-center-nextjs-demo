import ServiceSubList from "./ServiceSubList";
import { SubServices } from "@/context";
import Image, { StaticImageData } from "next/image";
type Service = {
    img_path: StaticImageData;
    heading: string;
    subheading: string;
    sub_service_list: SubServices;
};

export default function ServiceCard({ img_path, heading, subheading, sub_service_list }: Service) {
    return (
        <div className="w-full h-[34rem] rounded overflow-hidden shadow-lg">
            <Image
                src={img_path}
                alt={heading}
                priority={true}
                style={{
                    width: "100%",
                    height: "14rem",
                }}
            />

            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{heading}</div>
                <p className="text-gray-700 text-base">{subheading}</p>
            </div>
            <div className="px-6 pt-4 pb-2 max-h-36 overflow-y-auto">
                <ServiceSubList subServices={sub_service_list} />
            </div>
        </div>
    );
}
