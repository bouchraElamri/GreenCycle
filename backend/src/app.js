const express = require("express");
const cors = require("cors");
const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");
const clientRoutes = require("./routes/client.routes");
const sellerRoutes = require("./routes/seller.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
app.use(cors());

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/api", publicRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/client", clientRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

module.exports = app;