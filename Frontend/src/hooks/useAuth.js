import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    // Add isAdmin helper
    const isAdmin =
        context.user?.role === "admin" || context.user?.isAdmin === true;

    return {
        ...context,
        isAdmin,
    };
};
