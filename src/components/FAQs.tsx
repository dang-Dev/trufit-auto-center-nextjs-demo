"use client";

import Accordion from "./Accordion";
import { useState } from "react";

export default function FAQs() {
    const [accordions, setAccordion] = useState([
        {
            key: 1,
            title: "How much for PMS(Preventive Maintenance Schedule)?",
            data: `Thank you for your interest in our preventive maintenance schedule. 
            For specific pricing details and a tailored service package, please contact 
            us directly at +63918 774 7788. Our team will be more than happy to discuss 
            the pricing and provide you with all the information you need. We look forward 
            to assisting you with your vehicle's maintenance needs.`,
            isOpen: true,
        },
        {
            key: 2,
            title: "Is it now possible to order car parts for a suzuki car from you?",
            data: `Absolutely, we offer a wide range of car parts, including those for 
            Suzuki vehicles. Please provide us with the details of the specific parts 
            you're looking for, such as the model, year, and the part number if available. 
            Feel free to contact us or visit our shop, and our knowledgeable team will 
            assist you in sourcing the required Suzuki car parts. We're here to ensure 
            you get the right parts for your vehicle's needs.`,
            isOpen: false,
        },
        {
            key: 3,
            title: "What types of services do you offer?",
            data: `Thank you for your interest in our auto repair services! At our shop, 
            we offer a comprehensive range of services to cater to various vehicle needs. 
            These include routine maintenance such as oil changes, tire rotations, brake 
            inspections, and fluid checks. Additionally, we specialize in diagnostics, 
            engine and transmission repairs, electrical system troubleshooting, heating 
            and cooling system maintenance, and exhaust system repairs. Our skilled technicians 
            are equipped to handle both mechanical and auto body repairs, ensuring your vehicle 
            receives top-notch care. For specific details or any other service inquiries, 
            feel free to reach out, and our team will be more than happy to assist you.`,
            isOpen: false,
        },
        {
            key: 4,
            title: "How much is your windshield washer fluid?",
            data: `Thank you for your inquiry about our windshield washer fluid. For specific 
            pricing details or to learn more about our current offerings, please contact us 
            directly or visit our shop. Our team will be delighted to assist you and provide 
            you with all the necessary information. We look forward to helping you with your 
            automotive needs.`,
            isOpen: false,
        },
    ]);

    const toggleAccordion = (accordionKey: number) => {
        const updatedAccordions = accordions.map((accord) => {
            if (accord.key === accordionKey) {
                return { ...accord, isOpen: !accord.isOpen };
            } else {
                return { ...accord, isOpen: false };
            }
        });

        setAccordion(updatedAccordions);
    };
    return (
        <section className="relative pl-[2%] pr-[2%] pt-[20%] pb-[20%] lg:pt-[5%] lg:pb-[5%] h-screen" id="faqs">
            <div className="container mx-auto">
                <div className="text-center">
                    <h1 className="text-lg lg:text-4xl underline underline-offset-8 text-red-500 font-semibold font-sans">
                        FREQUENTLY ASKED QUESTIONS
                    </h1>
                </div>
                <div className="lg:w-[60%] mx-auto mt-8 lg:mt-12">
                    {accordions.map((accordion) => (
                        <Accordion
                            key={accordion.key}
                            title={accordion.title}
                            data={accordion.data}
                            isOpen={accordion.isOpen}
                            toggleAccordion={() => toggleAccordion(accordion.key)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
