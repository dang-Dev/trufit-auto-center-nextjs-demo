export default function UnAuthorizePage() {
    return (
        <div className="h-screen flex items-center justify-center">
            <h1 className="font-medium text-2xl leading-10 font-sans pe-5 border-e-2 border-black me-5">401</h1>
            <span className="text-sm">Unauthorized: Access denied</span>
        </div>
    );
}
