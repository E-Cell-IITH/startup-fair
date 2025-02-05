import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import MobileNav from '@/components/MobileNav'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { target: '/dashboard', label: 'Statistics' },
    { target: '/users', label: 'Users' },
    { target: '/startups', label: 'Startups' },
  ]

  function handleLogout() {
    fetch('http://localhost:6969/api/logout', {
      method: 'POST'
    }).then(() => {
      navigate('/login')
    })
  }

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
                <Link to={navItems[0].target} className='inline-flex items-center'>
                    <h1 className="font-bold">Admin Dashboard</h1>
                </Link>
                {navItems.map((item) => (
                  <NavLink
                    key={item.target}
                    to={item.target}
                    className={`${
                      location.pathname === item.target
                        ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium pointer-events-none'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="default" onClick={handleLogout}>
                Log out
              </Button>
              <div className="md:hidden ml-4">
                <MobileNav navItems={navItems} />
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

