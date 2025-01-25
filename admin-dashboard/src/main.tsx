import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import LoginPage from "./pages/login";
import './App.css'
import './index.css'
import StatisticsPage from "./pages/dashboard";
import UsersPage from "./pages/users";
import StartupsPage from "./pages/startups";
import NotFoundPage from "./pages/404";
import DashboardLayout from "./layouts/main";
import { Toaster } from "@/components/ui/toaster"
import UnauthenticatedLayout from "./layouts/unauthenticated";

const root = document.getElementById("root");

// @ts-ignore
ReactDOM.createRoot(root).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnauthenticatedLayout />}>
          <Route index element={<App />} />
          <Route path="login" element={<LoginPage />}/>
          <Route path="*" element={<NotFoundPage />}/>
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StatisticsPage />}/>
          <Route path="users" element={<UsersPage />}/>
          <Route path="startups" element={<StartupsPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </>
);