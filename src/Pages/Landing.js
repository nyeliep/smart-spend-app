import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Landing() {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-white", children: [_jsx("img", { src: "/Images/smartspendlogo.png", alt: "SmartSpend", className: "w-56 " }), _jsx("p", { className: "text-gray-600 text-center text-lg mb-4", children: "Track your spending. Take control of your allowance." }), _jsx("button", { onClick: () => (window.location.href = '/login'), className: "mt-6 bg-primary text-white py-2 px-6 rounded-lg", children: "Get started" })] }));
}
