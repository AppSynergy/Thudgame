import { Request } from "express";
import { simpleMessageHandler } from "./index";

test("api sends a message", async () => {
  const mockResponse: any = jest.fn();
  mockResponse.send = jest.fn();

  simpleMessageHandler({} as Request, mockResponse);

  expect(mockResponse.send).toHaveBeenCalledWith({
    message: "Backend is running!",
  });
});
