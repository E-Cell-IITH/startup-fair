import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";
import config from "../config.json";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.BACKEND_URL}/api/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      if (response.status === 201) {
        window.location.href = "/signup-success";
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn("User not found!");
          alert(`Error: ${error.response.data.error}`);
        } else {
          console.error("An error occurred while signing in", error);
          alert(`Error: ${error.response?.data.error}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: 'conic-gradient(from 180deg at 50% 50%, rgba(9, 59, 135, 0.5) -130.25deg, rgba(11, 75, 171, 0.5) 127deg, rgba(13, 87, 199, 0.5) 127.05deg, rgba(6, 43, 97, 0.5) 229.35deg, rgba(9, 59, 135, 0.5) 229.75deg, rgba(11, 75, 171, 0.5) 487deg), linear-gradient(270deg, rgba(255, 217, 217, 0.0512) 4.5%, rgba(158, 65, 163, 0.64) 100%);',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="E-Cell Logo"
              sx={{ height: 92 }}
            />
          </Box>

          <Typography
            sx={{
              mb: 15,
              fontWeight: "bold",
              background: "linear-gradient(90deg, rgba(197, 0, 154, 1), rgba(184, 185, 188, 1))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            fontSize={30}
          >
            STARTUP FAIR
          </Typography>

          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "96px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                marginLeft: '10px'
              },
              marginBottom: "1rem",
            }}
          />

          <TextField
            fullWidth
            label="E-Mail"
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "96px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                marginLeft: '10px'
              },
              marginBottom: "1rem",
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "96px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                marginLeft: '10px'
              },
              marginBottom: "1rem",
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: "96px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.35)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                marginLeft: '10px'
              },
              marginBottom: "1rem",
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                backgroundColor: "rgba(113, 16, 158, 0.79)",
                color: "white",
                padding: "0.75rem 3rem",
                borderRadius: "2rem",
                "&:hover": {
                  backgroundColor: "#7e22ce",
                },
                fontWeight: "bold",
              }}
            >
              {loading ? "Loading..." : "SIGN UP"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
