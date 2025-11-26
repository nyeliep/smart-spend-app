import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import Landing from "../Landing";
const originalLocation = window.location;
beforeAll(() => {
    const fakeLocation = { href: "" };
    Object.defineProperty(window, "location", {
        configurable: true,
        value: fakeLocation,
    });
});
afterAll(() => {
    Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
    });
});
describe("Landing Page", () => {
    it("renders logo, text, and button", () => {
        render(_jsx(Landing, {}));
        expect(screen.getByAltText("SmartSpend")).toBeInTheDocument();
        expect(screen.getByText("Track your spending. Take control of your allowance.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
    });
    it("redirects to login when button is clicked", () => {
        render(_jsx(Landing, {}));
        const button = screen.getByRole("button", { name: "Get started" });
        fireEvent.click(button);
        expect(window.location.href).toBe("/login");
    });
});
