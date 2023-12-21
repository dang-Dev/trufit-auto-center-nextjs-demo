import Image from "next/image";

export default function About() {
    return (
        <section
            className="relative pl-[2%] pr-[2%] pt-[20%] pb-[20%] lg:pt-[5%] lg:pb-[5%] h-screen bg-[#FEFAF9]"
            id="about-us"
        >
            <div className="container mx-auto">
                <div className="text-center">
                    <h1 className="text-lg lg:text-4xl underline underline-offset-4 lg:underline-offset-8 text-red-500 font-bold font-sans">
                        ABOUT US
                    </h1>
                </div>
                <div className="mt-4 text-center lg:w-[80%] mx-auto lg:mt-8">
                    <p className="text-neutral-500 text-sm lg:text-lg">
                        Trufit Auto Center Daet is an Automotive Repair Shop located at 1042 Barangay Gahonon, Vinzons
                        Ave. 4600 Daet, Camarines Norte. With customers around the province and other provinces.
                    </p>
                    <p className="text-neutral-500 mt-2 text-sm lg:text-lg">
                        Trufit Auto Center Daet is led by the owner, with the aim of providing services and care for the
                        beloved cars of their customers. Their services include full service of gasoline and diesel
                        engines of all makes, and diagnosis of vehicle electronics with advanced Autel testing
                        technology.
                    </p>
                </div>
                <div className="w-full mt-7">
                    <div className="relative lg:w-[60%] mx-auto h-[230px] lg:h-[400px]">
                        <Image src={"/images/store-picture.png"} fill alt="Store picture" />
                    </div>
                </div>
            </div>
        </section>
    );
}
