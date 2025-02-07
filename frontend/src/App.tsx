import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./services/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import PaymentPage from "./pages/PayPage";
import Leaderboard from "./pages/LeaderboardPage";
import ScanPage from "./pages/ScanPage";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import UserLeaderboard from "./pages/UserLeaderboardPage";
import SignUpPage from "./pages/RegisterPage";
import SuccessPage from "./pages/SuccessPage";
import SignUpSuccess from "./pages/SignUpSuccess";
import VerifyEmailPage from "./pages/VerifyEmailPage";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pay" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/user-leaderboard" element={<UserLeaderboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/signup-success" element={<SignUpSuccess />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
