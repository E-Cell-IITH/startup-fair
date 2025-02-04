import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

function getColorClass(value: number, thresholds: [number, number, number]): string {
  if (value < thresholds[0]) return 'text-green-600'
  if (value < thresholds[1]) return 'text-yellow-600'
  if (value < thresholds[2]) return 'text-orange-600'
  return 'text-red-600'
}

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    avgResponseTime: 0,
    maxResponseTime: 0,
    recentPayments: 0,
    totalPayments: 0,
    totalUsers: 0,
  })

  const { toast } = useToast() 

  useEffect(() => {
    // Here you would typically fetch the stats from an API

    if (!fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {method: 'GET', credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        setStats({
          avgResponseTime: data.average_response_time,
          maxResponseTime: data.max_response_time,
          recentPayments: data.recent_payments,
          totalPayments: data.payments,
          totalUsers: data.users,
        })
        return true
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
        duration: 2500,
      })
      console.error(err)
      return false
    })) return;

    const interval = setInterval(() => fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {method: 'GET', credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        setStats({
          avgResponseTime: data.average_response_time,
          maxResponseTime: data.max_response_time,
          recentPayments: data.recent_payments,
          totalPayments: data.payments,
          totalUsers: data.users,
        })
    }).catch((err) => {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
        duration: 2500,
      })
      console.error(err)
      clearInterval(interval)
    }), 5000);

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${getColorClass(stats.avgResponseTime, [100, 200, 250])}`}>
            {stats.avgResponseTime.toFixed(2)}ms
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Max Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${getColorClass(stats.maxResponseTime, [100, 200, 250])}`}>
            {stats.maxResponseTime.toFixed(2)}ms
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments (5s)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.recentPayments}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalPayments}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </CardContent>
      </Card>
    </div>
  )
}

