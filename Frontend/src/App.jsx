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

                        {/* catch all */}
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
