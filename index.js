import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/BookRoutes.jsx";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Routes
app.use("api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
