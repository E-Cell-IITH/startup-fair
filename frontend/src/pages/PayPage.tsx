import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Container } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import config from '../config.json'
import { Check, Error } from '@mui/icons-material'
import Navbar from '../components/Navbar'

const PaymentPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const amount = searchParams.get('amount')
  const [newBalance, setNewBalance] = useState(0)

  useEffect(() => {
    if (!id || !amount) {
      setError('Invalid payment URL')
      setLoading(false)
      return
    }

    setLoading(true);

    const fetchUser = async () => {
      try {
        const res = await axios.post(`${config.BACKEND_URL}/api/pay`, {
          startup_id: id,
          amount
        }, {
          withCredentials: true
        })

        if (res.status === 200) {
          console.log("Payment successful!");
          setNewBalance(res.data.new_balance)
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
  }, [amount, id])

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
                Processing Payment...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {error ? <Error color="error" sx={{ fontSize: 60 }} /> : <Check sx={{ fontSize: 60 }} />}
              <Typography variant="h6" color={`${error ? 'success.error' : 'success.main'}`}>
                {error ? error : 'Payment Successful!'}
              </Typography>
              {!error && (
                <Typography variant="h6">
                  New Balance: ${newBalance}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </>
  )
}

export default PaymentPage;
