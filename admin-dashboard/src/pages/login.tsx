import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="my-auto flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <LoginForm />
      </div>
    </div>
  )
}

