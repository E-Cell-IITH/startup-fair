import { Box, Typography, Container } from '@mui/material'
import Navbar from '../components/Navbar'

const SignUpSuccess = () => {
  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="success.main">
              Sign Up Successful!
            </Typography>
              <Typography variant="h6">
                Please check your email for verification link.
              </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default SignUpSuccess;
