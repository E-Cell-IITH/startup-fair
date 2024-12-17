import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";
import Navbar from "../components/Navbar";
import theme from "../theme";
import axios from "axios";
import config from "../config.json";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(`${config.BACKEND_URL}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.status === 200) window.location.href = "/";
      else alert(`Error: ${response.data.message}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn("User not found!");
          alert(`Error: ${error.response.data.message}`)
        } else {
          console.error("An error occurred while fetching user data", error);
          alert(`Error: ${error.response?.data.message}`)
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
