import {
    DatabaseOutlined,
    TeamOutlined,
    BarChartOutlined,
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserSwitchOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export const navLinks = [
    { name: "Features", path: "features" },
    { name: "Process", path: "process" },
    { name: "Testimonials", path: "testimonials" },
];

export const features = [
    {
        icon: <DatabaseOutlined />,
        title: "Inventory Tracking",
        description:
            "Real-time tracking of your inventory with automated updates and alerts.",
    },
    {
        icon: <BarChartOutlined />,
        title: "Advanced Analytics",
        description:
            "Gain insights with powerful reporting and visualization tools.",
    },
    {
        icon: <TeamOutlined />,
        title: "Team Collaboration",
        description:
            "Multiple user access with customizable permissions and roles.",
    },
];

export const testimonials = [
    {
        name: "Sarah Johnson",
        company: "Retail Solutions Inc.",
        content: `This inventory system has transformed how we track our products. We've reduced stockouts by 45% and improved order accuracy significantly.`,
        rating: 5,
    },
    {
        name: "Michael Chen",
        company: "Tech Distributors",
        content: `The analytics features have given us insights we never had before. We can now forecast inventory needs with impressive accuracy.`,
        rating: 5,
    },
    {
        name: "Jessica Martinez",
        company: "Global Logistics",
        content: `Implementation was smoother than expected, and the support team was there every step of the way. Highly recommend!`,
        rating: 4,
    },
];

export const steps = [
    {
        number: "1",
        title: "Sign Up for an Account",
        description:
            "Create your account in minutes and set up your inventory profiles.",
    },
    {
        number: "2",
        title: "Import Your Inventory",
        description:
            "Easily import your existing inventory data or start fresh.",
    },
    {
        number: "3",
        title: "Start Managing Efficiently",
        description:
            "Track, analyze, and optimize your inventory in real-time.",
    },
];

export const menuItems = [
    {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
        key: "products",
        icon: <AppstoreOutlined />,
        label: <Link to="/products">Products</Link>,
    },
    {
        key: "orders",
        icon: <ShoppingCartOutlined />,
        label: <Link to="/orders">Orders</Link>,
    },
    {
        key: "purchases",
        icon: <ShoppingOutlined />,
        label: <Link to="/purchases">Purchases</Link>,
    },
    {
        key: "customers",
        icon: <TeamOutlined />,
        label: <Link to="/customers">Customers</Link>,
    },
    {
        key: "suppliers",
        icon: <UserSwitchOutlined />,
        label: <Link to="/suppliers">Suppliers</Link>,
    },
    {
        key: "categories",
        icon: <AppstoreOutlined />,
        label: <Link to="/categories">Categories</Link>,
    },
    {
        key: "reports",
        icon: <BarChartOutlined />,
        label: <Link to="/reports">Reports</Link>,
    },
];

export const getStatusIcon = (status) => {
    const icons = {
        pending: <ClockCircleOutlined />,
        processing: <ClockCircleOutlined />,
        completed: <CheckCircleOutlined />,
        cancelled: <ClockCircleOutlined />,
    };
    return icons[status];
};

export const getStatusIconPurchase = (status) => {
    switch (status) {
        case "pending":
            return <ClockCircleOutlined />;
        case "completed":
        case "approved":
            return <CheckCircleOutlined />;
        case "returned":
            return <UndoOutlined />;
        default:
            return null;
    }
};
