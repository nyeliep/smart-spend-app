import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../Register";
import { MemoryRouter } from "react-router-dom";
import { registerUser } from "../../services/auth";


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>, 
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
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const confirmInput = screen.getByPlaceholderText("Confirm Password") as HTMLInputElement;

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

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "456" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
  });

  it("alerts when name is empty", () => {
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(window.alert).toHaveBeenCalledWith("Please enter your name");
  });

  it("calls registerUser and navigates on successful registration", async () => {
    (registerUser as Mock).mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

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
    (registerUser as Mock).mockRejectedValueOnce(new Error("Email exists"));
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await Promise.resolve();
    expect(window.alert).toHaveBeenCalledWith("Registration failed: Email exists");
  });
});
