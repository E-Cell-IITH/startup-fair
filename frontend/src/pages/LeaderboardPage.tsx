import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material'
import axios from 'axios'
import config from '../config.json'

interface LeaderboardEntry {
  id: number
  name: string
  icon: string
  equity_sold: number
  valuation: number
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/startup`,);
        setLeaderboardData(response.data)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 5 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
        LEADERBOARD
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        This is a free editable leaderboard design template from EDIT.org to customize online
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 100px',
          bgcolor: 'black',
          color: 'white',
          p: 2,
          mb: 1,
          borderRadius: '4px 4px 0 0'
        }}
      >
        <Typography variant="subtitle1">NAME</Typography>
        <Typography variant="subtitle1">METRIC</Typography>
        <Typography variant="subtitle1">RANK</Typography>
      </Box>

      {leaderboardData.map((entry, index) => (
        <Card
          key={entry.id}
          sx={{
            mb: 1,
            bgcolor: 'black',
            color: 'white',
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          <CardContent sx={{ p: '16px !important' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={entry.icon}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {entry.name}
                  </Typography>
                  {/* <Typography variant="body2">
                    {entry.jobTitle}
                  </Typography> */}
                </Box>
              </Box>
              <Box>
                <Typography variant="body1">
                  Equity: {entry.equity_sold}
                </Typography>
                <Typography variant="body1">
                  Valuation: {entry.valuation}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {index + 1}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Leaderboard
