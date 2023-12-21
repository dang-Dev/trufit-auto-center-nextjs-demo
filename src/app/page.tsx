import Services from "@/components/services";
import Testimonial from "@/components/testimonial";
import About from "@/components/about_us";
import FAQs from "@/components/FAQs";
import Footer from "@/components/footer";
import HomePage from "@/components/home";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Script from "next/script";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import FindUs from "@/components/FindUs";
import Gallery from "@/components/Gallery";
import RateUs from "@/components/Rate_us";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role === "ADMIN") {
        return redirect("/admin/dashboard");
    }

    return (
        <>
            <Header />
            <main className="relative">
                <HomePage session={session} />
                <Services />
                <Gallery/>
                {/* <Testimonial /> */}
                <About />
                <RateUs session={session}/>
                <FAQs />
                <FindUs/>
                <hr />
                <Footer />
            </main>
            {/* Tidio script */}
            <Script src="//code.tidio.co/ro3vflds0mtaitw5pwpls7tyozkxmhau.js" />
        </>
    );
}
