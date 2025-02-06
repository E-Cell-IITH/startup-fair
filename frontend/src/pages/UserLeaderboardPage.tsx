import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, useMediaQuery, useTheme, AppBar, Toolbar } from '@mui/material'
import axios from 'axios'
import config from '../config.json'
import GradientButton from '../components/GradientButton'
import { useNavigate } from 'react-router-dom'

interface UserLeaderboardData {
  id: number
  name: string
  net_worth: number
}

const UserLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserLeaderboardData[]>([])
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

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
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <img
            src="/logo.png"
            alt="E-Cell"
            style={{ height: '30px', filter: 'invert(1)' }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            <GradientButton variant="contained" onClick={() => navigate('/portfolio')}>Portfolio</GradientButton>
            <GradientButton variant="contained" onClick={() => navigate('/login')}>LOG IN</GradientButton>
          </Box>
        </Toolbar>
      </AppBar>
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 5 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
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
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {entry.name}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1">
                  Net worth: {entry.net_worth.toFixed(4)}
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

export default UserLeaderboard
