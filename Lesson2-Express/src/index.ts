import express, { Request, Response } from "express";
import userRoute from "./routes/user.route";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Chào mừng đến với ứng dụng");
});

app.use("api/users", userRoute);

app.listen(PORT, () => {
  console.log(`Server đang được chạy dưới cổng: ${PORT}`);
});
