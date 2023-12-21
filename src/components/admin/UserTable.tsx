import Link from "next/link";
import TableUser from "../table/TableUser";

async function getUsers() {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/auth/user?limit=10`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function UserTable({ slug }: { slug: string }) {
    const users = await getUsers();
    
    return (
        <div className="bg-neutral-100 rounded-md shadow-xl p-2">
            <div className="flex justify-between px-4">
                <span className="text-xl font-semibold">USERS</span>
                <Link href={`/admin/${slug}/add-user`} className="px-4 py-2 rounded text-white bg-green-600">
                    ADD USER
                </Link>
            </div>
            <TableUser users={users.data} total={users.total} slug={slug}  />
        </div>
    );
}


