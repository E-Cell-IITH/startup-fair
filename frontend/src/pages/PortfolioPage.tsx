import React from "react"
import { Container, Typography, Grid, Card, CardContent, Avatar, Box, Divider, AppBar, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles"
import GradientButton from "../components/GradientButton"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import config from '../config.json'

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgb(41, 41, 41)',
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

const NetWorth = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: 'white',
}))

const StartupCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}))

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/user/portfolio`, {
          withCredentials: true
        })
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchData()
  }, [])

  if (!userData) {
    return <Typography>Loading...</Typography>
  }

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
            <GradientButton variant="contained" onClick={() => navigate('/leaderboard')}>Leaderboard</GradientButton>
            <GradientButton variant="contained" onClick={() => navigate('/user-leaderboard')}>Top Users</GradientButton>
            <GradientButton variant="contained" onClick={() => navigate('/portfolio')}>Portfolio</GradientButton>
            <GradientButton variant="contained" onClick={() => navigate('/login')}>LOG IN</GradientButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <ProfileHeader>
          <Typography variant="h4" gutterBottom color="white">
            {userData.name}
          </Typography>
          <Typography variant="body1" color="white">{userData.email}</Typography>
          <Typography variant="h6" color="white">Balance: ${userData.balance.toLocaleString()}</Typography>
          <NetWorth>Net Worth: ${userData.net_worth.toLocaleString()}</NetWorth>
        </ProfileHeader>

        <Typography variant="h5" gutterBottom>
          Investments
        </Typography>
        <Grid container spacing={3}>
          {userData.investments.map((investment: any) => (
            <Grid item xs={12} sm={6} md={4} key={investment.id}>
              <StartupCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                      <img src={investment.startup.icon} alt={investment.startup.name} />
                    </Avatar>
                    <Typography variant="h6">{investment.startup.name}</Typography>
                  </Box>
                  <Divider />
                  <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Current Valuation: ${investment.startup.valuation.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Equity Owned: {(investment.equity * 100).toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amount Invested: ${investment.amount.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </StartupCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default PortfolioPage