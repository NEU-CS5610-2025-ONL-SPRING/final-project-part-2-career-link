import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyApplications from "./MyApplications";
import { useAuthUser } from "../../auth/authContext";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";

jest.mock("../../auth/authContext", () => ({
  useAuthUser: jest.fn(),
}));
jest.mock("../../auth/fetchWithAuth");

describe("MyApplications", () => {
  beforeEach(() => {
    useAuthUser.mockReturnValue({ user: { id: 1 } });
  });

  test("shows loading spinner initially", async () => {
    fetchGetWithAuth.mockReturnValue(new Promise(() => {}));
    render(<MyApplications />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders application table with one application", async () => {
    fetchGetWithAuth.mockResolvedValueOnce([
      {
        id: 101,
        status: "UNDER_REVIEW",
        appliedAt: "2024-04-01T00:00:00Z",
        job: {
          title: "Frontend Developer",
          company: { name: "Tech Corp" },
          location: "New York",
          isDeleted: false,
        },
      },
    ]);

    render(<MyApplications />);

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText("Tech Corp")).toBeInTheDocument();
      expect(screen.getByText("New York")).toBeInTheDocument();
      expect(screen.getByText("UNDER REVIEW")).toBeInTheDocument();
    });
  });
});
