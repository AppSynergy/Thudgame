import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;
mockAxios.get.mockResolvedValue({ data: "I am mock get.", status: 200 });

test("renders something", () => {
  render(<App />);

  expect(screen.getByText(/Hello, thud!/)).toBeInTheDocument();
});

test("can make a move and then reset the game", async () => {
  render(<App />);

  expect(screen.getByText(/Move number:.+0/));
  fireEvent.click(screen.getAllByText(/d/)[0]);
  fireEvent.click(screen.getByText(/a4/));

  await screen.findByText(/Move number:.+1/);
  fireEvent.click(screen.getByText(/Play both sides./));

  await screen.findByText(/Move number:\s0/);
});
