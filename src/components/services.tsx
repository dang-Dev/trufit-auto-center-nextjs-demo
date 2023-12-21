import ServiceSwiper from "./ServiceSlider";


export default function Services() {
    return (
        <section
            className="relative pl-[2%] pr-[2%] pt-[20%] pb-[20%] lg:pt-[5%] lg:pb-[5%] bg-[#FFFFFF]"
            id="services"
        >
            <div className="absolute bg-[#FFF4F4]  w-[32rem] h-[32rem] rounded-3xl left-[24%] top-[16%] rotate-45 z-0 opacity-50"></div>
            <div className="container mx-auto relative">
                <div className="w-full lg:mt-[2%]  mx-auto">
                    <div className="w-full mb-12">
                        <h2 className="text-2xl lg:text-4xl lg:leading-[3rem] lg:w-9/12 mx-auto text-center text-neutral-600">
                            We are here to help you make the right decisions to achieve your vehicle goals
                        </h2>
                        <p className="text-center mt-4 lg:w-8/12 mx-auto text-neutral-600 text-sm lg:text-base">
                            Welcome to Trufit Auto Center, your one-stop destination for comprehensive auto care. From
                            routine maintenance like oil changes and brake checks to intricate engine diagnostics and
                            repairs, our certified technicians are dedicated to keeping your vehicle running smoothly.
                            Trust us to deliver expert service, fair pricing, and a commitment to your safety and
                            satisfaction.
                        </p>
                    </div>
                    <ServiceSwiper />
                </div>
            </div>
        </section>
    );
}
