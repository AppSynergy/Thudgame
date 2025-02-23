import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import App from "./App";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;
mockAxios.get.mockResolvedValue({ data: "I am mock get.", status: 200 });

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

test("renders something", async () => {
  render(<App />);

  expect(screen.getByText(/Stats/)).toBeInTheDocument();
  await screen.findByText(/Your side is the Dwarfs/);
});

test("can make a move and then reset the game", async () => {
  render(<App />);

  expect(screen.getByText(/Move 1/));
  await screen.findByText(/Your side is the Dwarfs/);

  user.click(screen.getAllByText("d")[0]);
  user.click(screen.getByText("fC"));

  await screen.findByText(/Trolls to move next/);
  expect(screen.getByText(/Move 2/));

  user.click(screen.getByText(/Play both sides./));
  await screen.findByText(/Move 1/);
});

test("can play against Slabhead", async () => {
  render(<App />);

  user.click(screen.getByText(/Play the dwarfs vs. Slabhead/));
  await screen.findByText(/You are playing against Slabhead/);

  user.click(screen.getAllByText("d")[0]);
  user.click(screen.getByText("fC"));
  await screen.findByText(/Move 3/);
});

test("can play against Rashful", async () => {
  render(<App />);

  user.click(screen.getByText(/Play the trolls vs. Rashful/));
  await screen.findByText(/You are playing against Rashful/);

  await screen.findByText(/Move 2/);

  user.click(screen.getAllByText("T")[0]);
  user.click(screen.getByText("fA"));
  await screen.findByText(/Move 4/);
});
