import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, useMediaQuery, useTheme } from '@mui/material'
import axios from 'axios'
import config from '../config.json'
import Navbar from '../components/Navbar'

interface UserLeaderboardData {
  leaderboard: {
    id: number
    name: string,
    net_worth: number
  }[],
  user: {
    rank: number,
    name: string,
    net_worth: number
  }
}

const UserLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserLeaderboardData>()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/user?from=0`, {
          withCredentials: true
        });
        setLeaderboardData(response.data)
      } catch (error) {
        console.error('Error fetching user leaderboard data:', error)
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
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{ color: 'gray', mb: 2 }}
        >
          This data will be updated every minute. Invest to show up on leaderboard
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

        {leaderboardData?.leaderboard.map((entry, index) => (
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
            <CardContent
              sx={{
              p: '16px !important',
              bgcolor: leaderboardData?.user?.name === entry.name ? 'primary.main' : 'black'
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr 1fr' : '1fr 1fr 100px', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: leaderboardData?.user?.name === entry.name ? 'black' : 'white' }}>
                  {entry.name}
                </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: leaderboardData?.user?.name === entry.name ? 'black' : 'white' }}>
                Net worth: {entry.net_worth.toFixed(2)}
                </Typography>
              </Box>
              {!isSmallScreen && (
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: leaderboardData?.user?.name === entry.name ? 'black' : 'white' }}>
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

export default UserLeaderboard
