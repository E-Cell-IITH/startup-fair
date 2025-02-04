import { Link, Outlet } from 'react-router'

export default function UnauthenticatedLayout() {

  // @ts-ignore
  const navItems = []

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                    <img src="nav_logo.png" alt="E Cell" width={120}/>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <Link to='/login' className='inline-flex items-center'>
                        <h1 className="font-bold">Admin Dashboard</h1>
                    </Link>
                </div>
            </div>  
          </div>
        </div>
      </nav>

      <main className="py-6 px-8 flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

