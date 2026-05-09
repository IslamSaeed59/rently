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
const favoriteRoutes = require("./Src/Routes/FavoriteRoutes");
const chatRoutes = require("./Src/Routes/ChatRoutes");
const notificationRoutes = require("./Src/Routes/notificationRoutes");
const adminStatsRoutes = require("./Src/Routes/Admin/AdminStatsRoutes");
const aiRoutes = require("./Src/Routes/aiRoutes");
const paymentRoutes = require("./Src/Routes/PaymentRoutes");
const productReviewRoutes = require("./Src/Routes/ProductReviewRoutes");


const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./Src/Socket/socketHandler");

const PORT = process.env.PORT || 9000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed for production
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rental-requests", rentalRequestsRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", productReviewRoutes);


// Initialize Socket Handler
socketHandler(io);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
