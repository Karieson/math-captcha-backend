require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

// Allowed Frontend URLs
const allowedOrigins = [
  "https://garissadigitaltraining.onrender.com",
  "https://gdehworkshops.onrender.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without origin
      // (mobile apps, curl, Postman)

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true
  })
);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 5
    }
  })
);

// Home Route
app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Math CAPTCHA API Running"
  });
});

// Generate CAPTCHA
app.get("/captcha", (req, res) => {

  const num1 =
    Math.floor(Math.random() * 10) + 1;

  const num2 =
    Math.floor(Math.random() * 10) + 1;

  const answer = num1 + num2;

  // Store answer in session
  req.session.captcha = answer;

  res.json({
    success: true,
    question: `${num1} + ${num2} = ?`
  });
});

// Verify CAPTCHA
app.post("/verify", (req, res) => {

  const userAnswer =
    Number(req.body.answer);

  // Check answer
  if (
    userAnswer === req.session.captcha
  ) {

    // Destroy used captcha
    req.session.captcha = null;

    return res.json({
      success: true,
      message: "CAPTCHA Passed"
    });
  }

  res.json({
    success: false,
    message: "Wrong CAPTCHA Answer"
  });
});

// Handle invalid routes
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});
