import { Typography, Box, CardContent, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import Navbar from '../components/Navbar';
import { QrCode, RocketLaunch } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), rgba(0, 0, 0, 0.5))`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'white',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    height: '400px',
    padding: theme.spacing(2),
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  flex: 1,
  background: 'transparent',
  '& .MuiCardContent-root': {
    padding: theme.spacing(4, 2),
  },
}));

const CircularGauge = styled(Box)<{ color?: string }>(({ theme, color = '#4DC88D' }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  border: `3px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(2, 'auto'),
  fontSize: '24px',
  fontWeight: 'bold',
  color: color,
}));

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />
      <HeroSection>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            maxWidth: '800px',
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          <span style={{ color: '#4DC88D' }}>VENTURE VAULT</span>
          <br />
          VIRTUAL STARTUP PORTAL
          <br />
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Invest in the right startup and win exciting prizes.
        </Typography>
        <GradientButton size="large" onClick={() => navigate('/login')}>LOG IN</GradientButton>
      </HeroSection>
      <Container sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 600 }}
                  gutterBottom
                >
                  Network? Expanded
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Connect with industry leaders and fellow entrepreneurs.
                </Typography>
                <CircularGauge>7</CircularGauge>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
                <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 600 }}
                  gutterBottom
                >
                  How to Invest?
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Scan the QR code for your favourite startup and invest.
                </Typography>
                <QrCode color='success' sx={{ width: '60px', height: '60px' }} />
                </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 600 }}
                  gutterBottom
                >
                  Pro Tip
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Try to invest in the most popular startup the earliest. The sooner you invest the more the chances of winning increase.
                </Typography>
                <RocketLaunch color='success' sx={{ width: '60px', height: '60px' }}  />
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
