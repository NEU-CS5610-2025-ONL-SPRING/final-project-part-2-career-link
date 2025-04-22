import React from "react";
import { render, screen } from "@testing-library/react";
import MyApplications from "../components/employee/MyApplications";
import { useAuthUser } from "../auth/authContext";
import { fetchGetWithAuth } from "../auth/fetchWithAuth";

jest.mock("../auth/authContext", () => ({
  useAuthUser: jest.fn(),
}));
jest.mock("../auth/fetchWithAuth");

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

    expect(await screen.findByText("Frontend Developer")).toBeInTheDocument();
    expect(await screen.findByText("Tech Corp")).toBeInTheDocument();
    expect(await screen.findByText("New York")).toBeInTheDocument();
    expect(await screen.findByText("UNDER REVIEW")).toBeInTheDocument();
  });
});
