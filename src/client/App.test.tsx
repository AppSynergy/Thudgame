import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

test("renders something", () => {
  render(<App />);
  const words = screen.getByText(/Hello, thud!/i);
  expect(words).toBeInTheDocument();
});
