const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());

app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/stripe", require("./routes/stripe"));

app.use(cors());

// --------------------------DEPLOYMENT------------------------------

app.use(
    express.static(
      path.join(__dirname, "./../../../../client/_work/chadgpt-front", "build")
    )
  );

  app.get("*", (req, res) => {
    return res.sendFile(
      path.resolve(
        __dirname,
        "./../../../../client/_work/chadgpt-front",
        "build",
        "index.html"
      )
    );
});

// --------------------------DEPLOYMENT------------------------------

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on on ${PORT}`)
);

// Handling server errors with clean error messages
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
