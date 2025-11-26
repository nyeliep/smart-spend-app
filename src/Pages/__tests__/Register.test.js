import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../Register";
import { MemoryRouter } from "react-router-dom";
import { registerUser } from "../../services/auth";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ children, to }) => _jsx("a", { href: to, children: children }),
    };
});
vi.mock("../../services/auth", () => ({
    registerUser: vi.fn(),
}));
describe("Register Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("renders all components", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
        expect(screen.getByText("Already have an account?")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });
    it("updates input fields", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmInput = screen.getByPlaceholderText("Confirm Password");
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "pass123" } });
        fireEvent.change(confirmInput, { target: { value: "pass123" } });
        expect(nameInput.value).toBe("John Doe");
        expect(emailInput.value).toBe("john@example.com");
        expect(passwordInput.value).toBe("pass123");
        expect(confirmInput.value).toBe("pass123");
    });
    it("alerts when passwords do not match", () => {
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "456" } });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
    });
    it("alerts when name is empty", () => {
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "123" } });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        expect(window.alert).toHaveBeenCalledWith("Please enter your name");
    });
    it("calls registerUser and navigates on successful registration", async () => {
        registerUser.mockResolvedValueOnce({});
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "123" } });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        expect(registerUser).toHaveBeenCalledWith("a@b.com", "123", "John");
        await Promise.resolve();
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    it("alerts on registration failure", async () => {
        registerUser.mockRejectedValueOnce(new Error("Email exists"));
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(Register, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "123" } });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        await Promise.resolve();
        expect(window.alert).toHaveBeenCalledWith("Registration failed: Email exists");
    });
});
