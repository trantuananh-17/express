import express, { Request, Response } from "express";

const userRoute = express.Router();

userRoute.get("/", (req: Request, res: Response) => {
  const page = req.query.page;
  const limit = req.query.limit;

  res.json({
    message: "Danh sách người dùng",
    page: "Trang hiện tại: " + page,
    limit: "Số lượng dữ liệu trên 1 trang: " + limit,
  });
});

userRoute.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  res.json({
    message: "Thông tin chi tiết " + id,
  });
});

userRoute.post("/", (req: Request, res: Response) => {
  res.json({
    message: "Thêm người dùng mới",
  });
});

userRoute.put("/", (req: Request, res: Response) => {
  res.json({
    message: "Đã cập nhật người dùng",
  });
});

userRoute.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Đã xóa người dùng",
  });
});

export default userRoute;
