import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./services/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import PaymentPage from "./pages/PayPage";
import Leaderboard from "./pages/LeaderboardPage";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pay" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
