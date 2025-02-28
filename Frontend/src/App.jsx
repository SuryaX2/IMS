import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster />
                <div>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        {/* Protected routes (require verification) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute requireVerified={true}>
                                    <Home />
                                </ProtectedRoute>
                            }
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
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
