import EditUserForm from "../Forms/UserEditForm";

async function getUserById(id: string) {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/auth/user/${id}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }

        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function EditUser({ id }: { id: string }) {
    const { data } = await getUserById(id);
    return <EditUserForm data={data} isAdmin={true} />;
}
