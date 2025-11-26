import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login";
import { MemoryRouter } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../../services/auth";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock("../../services/auth", () => ({
    loginUser: vi.fn(),
    loginWithGoogle: vi.fn(),
}));
describe("Login Page", () => {
    it("renders all components", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign in with Google" })).toBeInTheDocument();
    });
    it("updates email and password fields", () => {
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        fireEvent.change(emailInput, { target: { value: "test@email.com" } });
        fireEvent.change(passwordInput, { target: { value: "mypassword" } });
        expect(emailInput.value).toBe("test@email.com");
        expect(passwordInput.value).toBe("mypassword");
    });
    it("calls loginUser and navigates on successful login", async () => {
        loginUser.mockResolvedValueOnce({});
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        expect(loginUser).toHaveBeenCalledWith("a@b.com", "pass123");
        await Promise.resolve();
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    it("shows alert on login failure", async () => {
        loginUser.mockRejectedValueOnce(new Error("Invalid credentials"));
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "wrong@b.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "fail" } });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        await Promise.resolve();
        expect(window.alert).toHaveBeenCalledWith("Login failed: Invalid credentials");
    });
    it("Google login works and navigates", async () => {
        loginWithGoogle.mockResolvedValueOnce({});
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));
        await Promise.resolve();
        expect(loginWithGoogle).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
});
