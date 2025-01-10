import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

export function simpleMessageHandler(_req: Request, res: Response) {
  res.send({ message: "Backend is running!" });
}

app.get("/api", simpleMessageHandler);

if (process.env.JEST_WORKER_ID == undefined) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
