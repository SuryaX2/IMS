import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import EmailVerify from "./pages/auth/EmailVerify";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/error/ErrorPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./components/ProfilePage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Products from "./pages/Products";
import Orders from "./pages/Orders";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster />
                <div>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        {/* Email verification route (protected, but doesn't require verification) */}
                        <Route
                            path="/email-verify"
                            element={
                                <ProtectedRoute requireVerified={false}>
                                    <EmailVerify />
                                </ProtectedRoute>
                            }
                        />
                        {/* Profile page (protected) */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Dashboard and related routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<Products />} />
                            <Route path="orders" element={<Orders />} />
                            {/* <Route path="purchases" element={<div>Purchases Page</div>} />
                            <Route path="customers" element={<div>Customers Page</div>} />
                            <Route path="suppliers" element={<div>Suppliers Page</div>} />
                            <Route path="categories" element={<div>Categories Page</div>} />
                            <Route path="reports">
                                <Route path="stock" element={<div>Stock Report</div>} />
                                <Route path="sales" element={<div>Sales Report</div>} />
                                <Route path="purchases" element={<div>Purchase Report</div>} />
                            </Route> */}
                        </Route>

                        {/* catch all */}
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
