import { Request, Response } from "express";
import { simpleMessageHandler } from "./index";

test("api sends a message", async () => {
  const mockResponse = (): Partial<Response> => {
    return {
      send: jest.fn().mockReturnThis(),
    };
  };

  const request = {} as Request;
  const response = mockResponse() as Response;

  simpleMessageHandler(request, response);

  expect(response.send).toHaveBeenCalledWith({
    message: "Backend is running!",
  });
});
