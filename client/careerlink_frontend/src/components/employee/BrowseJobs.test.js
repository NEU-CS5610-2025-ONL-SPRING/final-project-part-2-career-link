import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BrowseJobs from "./BrowseJobs";
import { useAuthUser } from "../../auth/authContext";
import {
  fetchGetWithAuth,
  fetchPostWithAuth,
} from "../../auth/fetchWithAuth";

jest.mock("../../auth/authContext", () => ({
  useAuthUser: jest.fn(),
}));
jest.mock("../../auth/fetchWithAuth");

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

  test("allows applying to a job and shows applied chip", async () => {
    const job = {
      id: 99,
      title: "Full Stack Developer",
      location: "Remote",
      company: { name: "DevCo" },
      employer: { username: "recruiter123" },
      createdAt: new Date().toISOString(),
    };

    fetchGetWithAuth
      .mockResolvedValueOnce([job])
      .mockResolvedValueOnce([]);

    fetchPostWithAuth.mockResolvedValueOnce({
      id: 1,
      jobId: 99,
      userId: 1,
    });

    render(<BrowseJobs />);
    const applyBtn = await screen.findByText("Apply");
    fireEvent.click(applyBtn);

    await waitFor(() => {
        expect(fetchPostWithAuth).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(screen.getByText("Applied")).toBeInTheDocument();
      });
      
  });
});
