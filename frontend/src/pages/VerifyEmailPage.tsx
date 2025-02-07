import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Container, Button } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import config from '../config.json'
import { ArrowBack, Check, Error } from '@mui/icons-material'
import Navbar from '../components/Navbar'

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const id = searchParams.get('id')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('Invalid payment URL')
      setLoading(false)
      return
    }

    setLoading(true);

    const fetchUser = async () => {
      try {
        const res = await axios.post(`${config.BACKEND_URL}/api/verify-email`, {
          token: token,
          id: id,
        }, {
          withCredentials: true
        })

        if (res.status === 200) {
          setTimeout(() => window.location.href = `/login`, 2000);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError(error.response.data.error)
          } else {
            setError(error.response?.data.error)
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id, token])

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
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">
                Verifying Email...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {error ? <Error color="error" sx={{ fontSize: 60 }} /> : <Check sx={{ fontSize: 60 }} />}
              <Typography variant="h6" color={`${error ? 'success.error' : 'success.main'}`}>
                {error ? error : 'Redirecting to login...'}
              </Typography>
            </Box>

          )}
          <Button variant='contained' sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={() => navigate('/portfolio')}>GO BACK</Button>
        </Box>
      </Container>
    </>
  )
}

export default VerifyEmailPage;
