export default function StatusTag({ status }: { status: string }) {
    const tagColor = (color: string) => {
        switch (color) {
            case "PENDING":
                return "bg-gray-500";
            case "ONGOING":
                return "bg-blue-500";
            case "EXPIRED":
                return "bg-red-500";
            case "DONE":
                return "bg-green-500";
            case "APPROVED":
                return "bg-purple-400";
            case "CANCELED":
                return "bg-yellow-400";
            default:
                break;
        }
    };

    return <span className={`px-2 py-1 rounded-full ${tagColor(status)} text-xs text-white `}>{status}</span>;
}
