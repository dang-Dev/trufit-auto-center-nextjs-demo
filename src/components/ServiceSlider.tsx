"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import ServiceCard from "./ServiceCard";

import { SubServices } from "@/context";

const other_services = ["Wheel and tire service", "Brake service", "Bodywork "];

const other_services_sub: SubServices = {
    checkBoxColor: "text-[#fb6290]",
    list: other_services,
};

const maintenance_and_inspection = [
    "Regular vehicle inspections",
    "Interval maintenance",
    "General wear + tear repair diagnosis",
];

const maintenance_and_inspection_sub_services: SubServices = {
    checkBoxColor: "text-[#2E5AF9]",
    list: maintenance_and_inspection,
};

const air_conditioning_service_and_repair = [
    "Running of all diagnostic checks",
    "Extracting and replacing the refrigerant",
    "Changing lubricant oil",
    "Conducting a full system refrigerant leak check using a variety of different testing methods.",
    "Providing annual service of your car’s air conditioning system",
];

const air_conditioning_service_and_repair_sub_services: SubServices = {
    checkBoxColor: "text-[#DA60EE]",
    list: air_conditioning_service_and_repair,
};

const diagnostic_of_vehicle_electronics = [
    "Vehicle electrics and electronics",
    "Battery charging systems",
    "Starting and ignition systems",
    "Lighting systems",
    "Battery service",
];

const diagnostic_of_vehicle_electronics_sub_services: SubServices = {
    checkBoxColor: "text-[#E22547]",
    list: diagnostic_of_vehicle_electronics,
};

const mechanical_repair = [
    "Repair and replace parts from the clutch or exhaust system up to the wheel bearing",
    "Motor check and repair of engine cooling systems",
    "Exchange of engine parts such as water pumps or intake elements",
];

const mechanical_repair_sub_servers: SubServices = {
    checkBoxColor: "text-[#60EE6E]",
    list: mechanical_repair,
};

const diesel_vehicle_services = [
    "Diagnosis of Diesel injection systems",
    "Examine and repair of diesel pressure system",
    "Exchange of faulty diesel components",
    "Examine and replace Bosch nozzles",
    "Examine and repair of pre-heating system and intake/exhaust system",
    "Dynamic timing adjustment",
    "Emission checks",
];

const diesel_vehicle_sub_services: SubServices = {
    checkBoxColor: "text-[#f7ea57]",
    list: diesel_vehicle_services,
};

import Service_Air_Condition from "../../public/images/services-air-condition.jpg";
import Service_Car_Maintenance from "../../public/images/car-maintenance.jpg";
import Service_Vehicle_Electronics from "../../public/images/electrical-diagnostics.jpg";
import Service_Mechanic_Repair from "../../public/images/DIY-Auto-Repair-Tips.png";
import Service_Diesel_Engine from "../../public/images/Service-Diesel-Engines.jpg";
import Service_Others from "../../public/images/others-services.jpg";

export default function ServiceSwiper() {
    return (
        <Swiper
            spaceBetween={24}
            // centeredSlides={true}
            // autoplay={{
            //     delay: 2500,
            //     disableOnInteraction: false,
            // }}
            pagination={{
                clickable: true,
            }}
            slidesPerView={1}
            // navigation={true}
            modules={[Pagination, Navigation]}
            style={{
                width: "100%",
                height: "36rem",
            }}
            breakpoints={{
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 25,
                },
            }}
        >
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Air_Condition}
                    heading="Air Conditioning Service & Repair"
                    subheading="Service using high-specification equipment supplied by Bosch. Work includes:"
                    sub_service_list={air_conditioning_service_and_repair_sub_services}
                />
            </SwiperSlide>
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Car_Maintenance}
                    heading="Maintenance and Inspection"
                    subheading="Affordable quality service and Bosch parts."
                    sub_service_list={maintenance_and_inspection_sub_services}
                />
            </SwiperSlide>
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Vehicle_Electronics}
                    heading="Diagnostic of Vehicle Electronics"
                    subheading="Service with know-how from the global no. 1 supplier of diesel injection
                    technology."
                    sub_service_list={diesel_vehicle_sub_services}
                />
            </SwiperSlide>
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Diesel_Engine}
                    heading="Diesel Vehicle Services"
                    subheading="Service using high-specification equipment supplied by Bosch. Work includes:"
                    sub_service_list={air_conditioning_service_and_repair_sub_services}
                />
            </SwiperSlide>
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Mechanic_Repair}
                    heading="Mechanical Repair"
                    subheading="Components repair and attractive package offers."
                    sub_service_list={mechanical_repair_sub_servers}
                />
            </SwiperSlide>
            <SwiperSlide>
                <ServiceCard
                    img_path={Service_Others}
                    heading="Other Services"
                    subheading="Profit from our full expert service whenever your car needs service."
                    sub_service_list={other_services_sub}
                />
            </SwiperSlide>
        </Swiper>
    );
}
