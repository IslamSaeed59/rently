const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(express.static("dist"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

dotenv.config();

const authRoutes = require("./Src/Routes/authRoutes");
const profileRoutes = require("./Src/Routes/profileRoutes");
const categoriesRoutes = require("./Src/Routes/Categories/CategoriesRoutes");
const userRoutes = require("./Src/Routes/UserRoutes");
const productRoutes = require("./Src/Routes/products/ProductsRoutes");
const rentalRequestsRoutes = require("./Src/Routes/Rentals/RentalRequestsRoutes");
const rentalsRoutes = require("./Src/Routes/Rentals/RentalsRoutes");
const availabilityRoutes = require("./Src/Routes/Rentals/AvailabilityRoutes");


const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rental-requests", rentalRequestsRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/availability", availabilityRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
