import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;
mockAxios.get.mockResolvedValue({ data: "I am mock get.", status: 200 });

test("renders something", async () => {
  render(<App />);

  expect(screen.getByText(/Hello, thud!/)).toBeInTheDocument();
  await screen.findByText(/Your side is the Dwarfs/);
});

test("can make a move and then reset the game", async () => {
  render(<App />);
  const user = userEvent.setup();

  expect(screen.getByText(/Move number: 0/));
  await screen.findByText(/Your side is the Dwarfs/);

  user.click(screen.getAllByText("d")[0]);
  user.click(screen.getByText(/a4/));

  await screen.findByText(/Trolls to move next/);
  expect(screen.getByText(/Move number: 1/));

  await user.click(screen.getByText(/Play both sides./));
  await screen.findByText(/Move number: 0/);
});
