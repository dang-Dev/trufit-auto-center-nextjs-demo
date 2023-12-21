import BulkSendNotificationForm from "@/components/Forms/BulkSendNotificationForm";

export default async function BulkSendNotification() {
    return (
        <>
            <h1 className="text-lg font-semibold mb-1">Bulk Send Notification to:</h1>
            <BulkSendNotificationForm />
        </>
    );
}
