const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const SERVER = localhost;
app.use(express.static(__dirname));

// Routes (optional but clean URLs)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(
    path.join(__dirname, "User Management.html")
  );
});

app.get("/product-upload", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Product Upload.html")
  );
});

app.get("/products", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Products.html")
  );
});
app.get("/payment", (req, res) => {
  res.sendFile(
    path.join(__dirname, "payment.html")
  );
});

app.get("/course-enrollment", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Course Enrollment.html")
  );
});

app.get("/tutorials", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Tutorials.html")
  );
});

app.get("/orders", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Orders.html")
  );
});

app.listen(PORT,SERVER, () => {
  console.log(`Admin dashboard running at http://localhost:${PORT}`);
});
