const express = require("express");

const checklistUserRouter = require("./routes/checklistUser");
const checklistFolderRouter = require("./routes/checklistFolder");

const app = express();

app.use(express.json());

require("./db/mongoose.js");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type,Accept,x-auth-token"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

app.use("/checklistUser", checklistUserRouter);
app.use("/checklistFolder", checklistFolderRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
