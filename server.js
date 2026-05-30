require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 5
    }
  })
);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Math CAPTCHA API Running"
  });
});

// Generate CAPTCHA
app.get("/captcha", (req, res) => {

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;

  const answer = num1 + num2;

  req.session.captcha = answer;

  res.json({
    question: `${num1} + ${num2} = ?`
  });
});

// Verify CAPTCHA
app.post("/verify", (req, res) => {

  const userAnswer = Number(req.body.answer);

  if(userAnswer === req.session.captcha){

    return res.json({
      success: true,
      message: "CAPTCHA Passed"
    });
  }

  res.json({
    success: false,
    message: "Wrong Answer"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
