import { useNavigate } from "react-router"

export default function NotFoundPage() {

    const navigate = useNavigate();

    setTimeout(() => {navigate('/login')}, 3000);

    return (
        <div className="my-auto flex items-center justify-center bg-gray-100">
        <div className="max-w-fit w-full space-y-8 p-8 px-16 bg-white rounded-xl shadow-md">
            <h1 className="my-6 text-center text-6xl font-extrabold text-gray-900">
            404 Not Found
            </h1>
            <p className="text-center text-gray-500">The page you are looking for does not exist. Redirecting...</p>
        </div>
        </div>
    )
}