import Link from "next/link";

export default function UnAuthorized({ params }: Readonly<{ params: { token: string } }>) {
    const decoded_token = atob(decodeURIComponent(params.token));

    return (
        <div className="w-screen mt-[8rem]">
            <div className="w-[30rem] mx-auto border rounded shadow p-3 text-center">
                You Don&apos;t have account associate with this google account.
                <div>
                    Email: <strong>{decoded_token}</strong>
                </div>
                <div className="mt-7 mb-2">
                    <Link
                        href={"/"}
                        className="outline outline-2 rounded-md px-2 py-1 outline-green-700 hover:text-white hover:bg-green-700 hover:outline-none"
                    >
                        back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
