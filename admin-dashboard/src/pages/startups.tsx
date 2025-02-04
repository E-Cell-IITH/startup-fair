import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export default function StartupsPage() {
  const [startups, setStartups] = useState<{id: number, name: string, icon: string, valuation: number}[]>([])
  const {toast} = useToast()

  useEffect(() => {
    fetch('https://sf-api.ecelliith.org.in/admin/api/startup', {
      method: 'GET',
      credentials: 'include',
    }).then(async response => {
      if (response.ok) {
        setStartups(await response.json());
      } else {
        toast({
          title: 'Server Error',
          description: 'Error ocurred while trying to load startups' + await response.text(),
          variant: 'destructive',
          duration: 2500,
        })
      }
    }).catch(err => {
      toast({
        title: 'Error',
        description: 'Error ocurred while trying to load startups' + err.message,
        variant: 'destructive',
        duration: 2500,
      })
    })
  }, [])

  const [editingStartup, setEditingStartup] = useState<null | { id: number, name: string, icon: string, valuation: number }>(null)
  const [newStartup, setNewStartup] = useState({ name: '', icon: '', valuation: 0 })
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogId, setEditDialogId] = useState<null | number>(null)

  const handleEditStartup = (startup: { id: number, name: string, icon: string, valuation: number }) => {
    setEditingStartup(startup)
  }

  const handleSaveEdit = () => {
    if (editingStartup) {

      fetch(`https://sf-api.ecelliith.org.in/admin/api/admin/startup/${editingStartup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editingStartup),
      }).then(async response => {
        if (!response.ok) {
          toast({
            title: 'Server Error',
            description: 'An error occurred while updating the startup:\n' + await response.text(),
            variant: 'destructive',
            duration: 2500,
          })
        } else {
            setStartups(startups.map(s => s.id === editingStartup.id ? editingStartup : s))
            toast({
              title: 'Success',
              description: 'The startup has been updated successfully',
              variant: 'default',
              duration: 2500,
            })
          }
        }).catch(error => {
          console.error('Error:', error)
          toast({
            title: 'Error',
            description: 'An error occurred while updating the startup:\n' + error.message,
            variant: 'destructive',
            duration: 2500,
          })
        })

      setEditingStartup(null)
      setEditDialogId(null)
    }
  }

  const handleAddStartup = () => {

    fetch('https://sf-api.ecelliith.org.in/admin/api/admin/startup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newStartup),
    }).then(async response => {
        if (!response.ok) {
          toast({
            title: 'Server Error',
            description: 'An error occurred while adding the startup:\n' + await response.text(),
            variant: 'destructive',
            duration: 2500,
          })
        } else {
          let data = await response.json()
          setStartups([...startups, data])
          toast({
            title: 'Success',
            description: 'The startup has been added successfully',
            variant: 'default',
            duration: 2500,
          })
        }
      }).catch(error => {
        console.error('Error:', error)
        toast({
          title: 'Error',
          description: 'An error occurred while adding the startup:\n' + error.message,
          variant: 'destructive',
          duration: 2500,
        })
      });
    setAddDialogOpen(false)
    setNewStartup({ name: '', icon: '', valuation: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg max-w-5xl mx-auto">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Startups</h3>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Startup</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Startup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newStartup.name}
                      onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-icon">Icon URL</Label>
                    <Input
                      id="new-icon"
                      value={newStartup.icon}
                      onChange={(e) => setNewStartup({ ...newStartup, icon: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-valuation">Valuation</Label>
                    <Input
                      id="new-valuation"
                      type="number"
                      value={newStartup.valuation}
                      onChange={(e) => setNewStartup({ ...newStartup, valuation: Number(e.target.value) })}
                    />
                  </div>
                  <Button onClick={handleAddStartup}>Add Startup</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Valuation</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map((startup) => (
                  <TableRow key={startup.id}>
                    <TableCell>{startup.name}</TableCell>
                    <TableCell>{startup.icon}</TableCell>
                    <TableCell>{startup.valuation.toLocaleString()}</TableCell>
                    <TableCell>
                      <Dialog open={editDialogId === startup.id} onOpenChange={(open) => setEditDialogId(open ? startup.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => handleEditStartup(startup)}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Startup</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={editingStartup?.name || ''}
                                onChange={(e) => setEditingStartup(prev => prev ? {...prev, name: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="icon">Icon URL</Label>
                              <Input
                                id="icon"
                                value={editingStartup?.icon || ''}
                                onChange={(e) => setEditingStartup(prev => prev ? {...prev, icon: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="valuation">Valuation</Label>
                              <Input
                                id="valuation"
                                type="number"
                                value={editingStartup?.valuation || ''}
                                onChange={(e) => setEditingStartup(prev => prev ? {...prev, valuation: Number(e.target.value)} : null)}
                              />
                            </div>
                          <Button onClick={handleSaveEdit}>Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
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

