import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

function fetchUsers(toast: any, searchTerm: string) {
  if (searchTerm.length < 3) {
    return Promise.resolve([])
  }

  return fetch('http://localhost:6969/api/admin/user?' + new URLSearchParams({
    search: searchTerm
  }).toString(), {
    method: 'GET',
    credentials: 'include',
    
  }).then(async (response) => {
    if (response.ok) {
      let data = await response.json()
      return data
    } else {
      toast({
        title: 'Server Error',
        description: 'An error occurred while fetching the users:\n' + await response.text(),
        variant: 'destructive',
        duration: 2500,
      })
      return []
    }
  }).catch((error) => {
    toast({
      title: 'Error',
      description: 'An error occurred while fetching the users:\n' + error,
      variant: 'destructive',
      duration: 2500,
    })
    return []
  })
}

export default function UsersPage() {
  const {toast} = useToast()
  const [users, setUsers] = useState<{
    name: string
    email: string
    balance: number
    netWorth: number
  }[]>([])

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', balance: 0 })
  const [blockEmail, setBlockEmail] = useState('')
  const [unblockEmail, setUnblockEmail] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [unblockUserOpen, setUnblockUserOpen] = useState(false)

  useEffect(() => {
    const searchDelay = setTimeout(async () => setUsers(await fetchUsers(toast, searchTerm)), 1000)

    return () => clearTimeout(searchDelay)
  }, [searchTerm])

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    fetch('http://localhost:6969/api/admin/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
      credentials: 'include'
    }).then(async response => {
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'The user has been added successfully',
          variant: 'default',
          duration: 2500,
        })
      } else {
        toast({
          title: 'Server Error',
          description: 'An error occurred while adding the user:\n' + (await response.json()).error,
          variant: 'destructive',
          duration: 2500,
        })
      }
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'An error occurred while adding the user:\n' + err.message,
        variant: 'destructive',
        duration: 2500,
      })
    })

    setNewUser({ name: '', email: '', password: '', balance: 0 })
    setAddUserOpen(false);
  }

  const handleBlockUser = (e: React.FormEvent) => {
    e.preventDefault()

    fetch(`http://localhost:6969/api/admin/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: blockEmail}),
      credentials: 'include'
    }).then(async response => {
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'The user has been blocked successfully',
          variant: 'default',
          duration: 2500,
        })
      } else {
        toast({
          title: 'Server Error',
          description: 'An error occurred while blocking the user:\n' + await response.text(),
          variant: 'destructive',
          duration: 2500,
        })
      }
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'An error occurred while blocking the user:\n' + err.message,
        variant: 'destructive',
        duration: 2500,
      })
      console.log(err)
    })

    setBlockEmail('')
    setBlockUserOpen(false);
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const handleUnblockUser = (e: React.FormEvent) => {
    e.preventDefault()

    fetch(`http://localhost:6969/api/admin/unblock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: unblockEmail}),
      credentials: 'include'
    }).then(async response => {
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'The user has been unblocked successfully',
          variant: 'default',
          duration: 2500,
        })
      } else {
        toast({
          title: 'Server Error',
          description: 'An error occurred while unblocking the user:\n' + await response.text(),
          variant: 'destructive',
          duration: 2500,
        })
      }
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'An error occurred while unblocking the user:\n' + err.message,
        variant: 'destructive',
        duration: 2500,
      })
      console.log(err)
    })

    setUnblockEmail('')
    setUnblockUserOpen(false);
  }

  return (
    <div className="space-y-6 max-w-[80vw] min-w-[1024px] mx-auto">

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User List <span className='text-sm'>(Search to load users)</span></h3>
          <div className="mt-5 space-y-4">
            <div className="space-x-4 flex justify-between">
              {/* <Label htmlFor="search">Search Users</Label> */}
              <Input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                className='w-96'
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="space-x-4 min-w-fit">
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>Add User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="text"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="balance">Starting Balance</Label>
                        <Input
                          type="number"
                          id="balance"
                          value={newUser.balance}
                          onChange={(e) => setNewUser({ ...newUser, balance: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <Button onClick={handleAddUser}>Add User</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={unblockUserOpen} onOpenChange={setUnblockUserOpen}>
                  <DialogTrigger asChild>
                    <Button>Unblock User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unblock a User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className='my-4 text-red-600'>This will restore the user's ability to make payments.</p>
                        <Label htmlFor="unblockEmail">Email</Label>
                        <Input
                          type="email"
                          id="unblockEmail"
                          value={unblockEmail}
                          onChange={(e) => setUnblockEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button className="mx-auto" onClick={handleUnblockUser}>Unblock User</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={blockUserOpen} onOpenChange={setBlockUserOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Block User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Block a User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className='my-4 text-red-600'>This will render the user unable to make any investments. But they will still be able to access the site.</p>
                        <Label htmlFor="blockEmail">Email</Label>
                        <Input
                          type="email"
                          id="blockEmail"
                          value={blockEmail}
                          onChange={(e) => setBlockEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button className="mx-auto" variant="destructive" onClick={handleBlockUser}>Block User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Net Worth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.balance}</TableCell>
                    <TableCell>{user.netWorth}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

