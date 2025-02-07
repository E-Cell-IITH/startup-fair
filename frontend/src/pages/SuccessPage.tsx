import { Box, Typography, Container, Button } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowBack, Check, Error } from '@mui/icons-material'
import Navbar from '../components/Navbar'

const SuccessPage = () => {
  const [searchParams] = useSearchParams()
  const newBalance = searchParams.get('new_balance')
  const error = searchParams.get('error')
  const navigate = useNavigate();

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
            {error ? <Error color="error" sx={{ fontSize: 60 }} /> : <Check sx={{ fontSize: 60 }} />}
            <Typography variant="h6" color={`${error ? 'success.error' : 'success.main'}`}>
              {error ? error : 'Successfully Invested!'}
            </Typography>
            {!error && (
              <Typography variant="h6">
                New Balance: ${newBalance}
              </Typography>
            )}
          </Box>
          <Button variant='contained' sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={() => navigate('/portfolio')}>GO BACK</Button>
        </Box>
      </Container>
    </>
  )
}

export default SuccessPage;
