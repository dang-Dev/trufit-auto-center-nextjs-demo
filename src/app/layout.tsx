import { AuthProvider } from "@/app/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
    metadataBase: new URL('https://trufitautocenter.com'),
    title: "Trufit Auto Center - Book your Appointment with us",
    description: "Trufit Auto Center Daet providing automotive services.",
    openGraph: {
        title: 'Trufit Auto Center',
        description: 'Trufit Auto Center Daet providing automotive services.',
        images: ['/images/store-picture.png'],
        type:'website'
    }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className="scroll-smooth" lang="en">
            <body className={inter.className}>
                <AuthProvider>{children}</AuthProvider>
                <ToastContainer />
            </body>
        </html>
    );
}
