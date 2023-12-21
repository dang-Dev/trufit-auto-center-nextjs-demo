"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

interface GalleryProps {}

const Gallery: React.FC<GalleryProps> = () => {
    return (
        <section className="container mx-auto pl-[2%] pr-[2%]">
            <h1 className="text-center text-lg lg:text-4xl underline underline-offset-8 text-red-500 font-semibold font-sans mb-7">
                GALLERY
            </h1>
            <div className="shadow-lg p-2 rounded bg-gray-100">
                <Swiper
                    className="lg:h-[32rem] h-[18rem]"
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    spaceBetween={10}
                    pagination={true}
                    slidesPerView={1}
                    modules={[Autoplay, Pagination]}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 1,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                    }}
                >
                    <SwiperSlide>
                        <img src="/images/gallery/17.jpg" alt="Image 17" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/1.jpg" alt="Image 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/2.jpg" alt="Image 2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/3.jpg" alt="Image 3" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/4.jpg" alt="Image 4" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/5.jpg" alt="Image 5" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/6.jpg" alt="Image 6" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/7.jpg" alt="Image 7" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/8.jpg" alt="Image 8" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/9.jpg" alt="Image 9" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/10.jpg" alt="Image 10" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/14.jpg" alt="Image 14" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/gallery/18.jpg" alt="Image 18" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </section>
    );
};

export default Gallery;
