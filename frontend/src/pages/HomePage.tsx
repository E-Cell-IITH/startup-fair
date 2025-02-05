import { AppBar, Toolbar, Button, Typography, Box, CardContent, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const GradientButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF8C00',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e67e00',
  },
  padding: '10px 20px',
  borderRadius: '4px',
  textTransform: 'uppercase',
}));

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

const CreditScoreGauge = styled(Box)(({ theme }) => ({
  width: '120px',
  height: '12px',
  background: 'linear-gradient(to right, #ff4d4d, #ffeb3b, #4DC88D)',
  borderRadius: '6px',
  margin: theme.spacing(5, 'auto'),
  position: 'relative',
  '&::after': {
    content: '"748"',
    position: 'absolute',
    top: '-25px',
    right: '0',
    color: '#666',
    fontSize: '16px',
    fontWeight: 'bold',
  },
}));

const ProgressCircle = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  margin: theme.spacing(2, 'auto'),
  background: 'conic-gradient(from 0deg, #4DC88D 0%, #FFB74D 50%, #FF7043 100%)',
  borderRadius: '50%',
}));

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
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
            <GradientButton variant="contained" onClick={() => navigate('/login')}>LOG IN</GradientButton>
          </Box>
        </Toolbar>
      </AppBar>
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
          <span style={{ color: '#4DC88D' }}>E-CELL STARTUP FAIR</span>
          <br />
          VIRTUAL STARTUP PORTAL
          <br />
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Join us to explore innovative startups and connect with like-minded entrepreneurs.
        </Typography>
        <GradientButton size="large">SIGN UP FREE</GradientButton>
      </HeroSection>
      <Container sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
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
                  Resources? Provided
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Access a wealth of resources to help your startup succeed.
                </Typography>
                <ProgressCircle />
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
                  Funding? Secured
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Learn how to secure funding and grow your startup.
                </Typography>
                <CreditScoreGauge />
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
