import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios'
import config from '../config.json'
import Navbar from '../components/Navbar'

interface LeaderboardEntry {
  id: number
  name: string
  icon: string
  equity_sold: number
  valuation: number
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/startup`, {
          withCredentials: true
        });
        setLeaderboardData(response.data)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 5 }}>
        <Typography
          variant={isSmallScreen ? 'h4' : 'h2'}
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          LEADERBOARD
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isSmallScreen ? '1fr 1fr' : '1fr 1fr 100px',
            bgcolor: 'black',
            color: 'white',
            p: 2,
            mb: 1,
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Typography variant="subtitle1">NAME</Typography>
          <Typography variant="subtitle1">METRIC</Typography>
          {!isSmallScreen && <Typography variant="subtitle1">RANK</Typography>}
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
              <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr 1fr' : '1fr 1fr 100px', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* <Avatar
                    src={entry.icon}
                    sx={{ width: 56, height: 56 }}
                  /> */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {entry.name}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1">
                    Valuation: {entry.valuation}
                  </Typography>
                  <Typography variant="body1">
                    Equity Sold: {(entry.equity_sold * 100).toFixed(2)}%
                  </Typography>
                </Box>
                {!isSmallScreen && (
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {index + 1}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  )
}

export default Leaderboard
