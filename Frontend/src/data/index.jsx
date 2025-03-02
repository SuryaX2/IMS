import {
    DatabaseOutlined,
    TeamOutlined,
    BarChartOutlined,
} from "@ant-design/icons";

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
