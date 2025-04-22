import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Experience from "../components/experience/Experience";
import { useAuthUser } from "../auth/authContext";

jest.mock("../auth/authContext", () => ({
  useAuthUser: jest.fn(),
}));

jest.mock("../auth/fetchWithAuth", () => ({
  fetchGetWithAuth: jest.fn(() => Promise.resolve([])),
  fetchPostWithAuth: jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 1 }) })),
  fetchPutWithAuth: jest.fn(),
  fetchDeleteWithAuth: jest.fn(),
}));

describe("Experience Component", () => {
  beforeEach(() => {
    useAuthUser.mockReturnValue({
      user: { id: 123 },
    });
  });

  test("renders 'Add' button and empty state", async () => {
    render(<Experience />);
    const addButton = await screen.findByText("Add");
    expect(addButton).toBeInTheDocument();
  });

  test("opens dialog on clicking 'Add' button", async () => {
    render(<Experience />);
    fireEvent.click(screen.getByText("Add"));
    expect(await screen.findByText("Add New Experience")).toBeInTheDocument();
  });

  test("shows validation error when required fields are missing", async () => {
    render(<Experience />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(await screen.findByText("Submit"));

    expect(await screen.findByText("Company, Job Title, and Start Date are required.")).toBeInTheDocument();
  });
});
