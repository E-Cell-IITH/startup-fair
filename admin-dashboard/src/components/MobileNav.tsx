import { useState } from 'react'
import { NavLink } from 'react-router'
import { useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface NavItem {
  target: string
  label: string
}

export default function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col space-y-4 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.target}
              to={item.target}
              className={`${
                location.pathname === item.target
                  ? 'text-indigo-600 font-medium pointer-events-none'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

