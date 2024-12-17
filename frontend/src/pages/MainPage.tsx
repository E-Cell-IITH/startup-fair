import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Divider,
} from '@mui/material'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { QrCodeScanner } from '@mui/icons-material';

const MainPage = () => {
  const [id, setId] = useState('')
  const [amount, setAmount] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  const handleManualSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (id && amount) {
      window.location.href = `/pay?id=${id}&amount=${amount}`
    }
  }

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      console.log(result)
      if (result) {
        window.location.href = result
      }
    }
  }

  return (
    <>
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
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Payment Details
          </Typography>
          <Box component="form" onSubmit={handleManualSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="ID"
              name="id"
              autoComplete="id"
              autoFocus
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              id="amount"
              autoComplete="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
          <Divider sx={{ my: 2, width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<QrCodeScanner />}
            onClick={() => setShowScanner(!showScanner)}
            sx={{ mt: 2 }}
          >
            Scan QR Code
          </Button>
          {showScanner && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <Scanner onScan={handleScan} />
            </Box>
          )}
        </Box>
      </Container>
    </>
  )
}

export default MainPage;
