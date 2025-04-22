import React from "react";
import { render, screen } from "@testing-library/react";
import BrowseJobs from "../components/employee/BrowseJobs";
import { useAuthUser } from "../auth/authContext";
import {
  fetchGetWithAuth,
} from "../auth/fetchWithAuth";

jest.mock("../auth/authContext", () => ({
  useAuthUser: jest.fn(),
}));
jest.mock("../auth/fetchWithAuth");

jest.mock("@mui/material/styles", () => {
  const actual = jest.requireActual("@mui/material/styles");
  return {
    ...actual,
    useTheme: () => actual.createTheme(),
  };
});

describe("BrowseJobs", () => {
  beforeEach(() => {
    useAuthUser.mockReturnValue({ user: { id: 1 } });
  });

  test("renders heading and filters", async () => {
    fetchGetWithAuth.mockResolvedValueOnce([]);
    fetchGetWithAuth.mockResolvedValueOnce([]);

    render(<BrowseJobs />);

    expect(await screen.findByText(/Explore Job Opportunities/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Job Title")).toBeInTheDocument();
  });
});
