require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const useCors = require("./middlewares/cors");
const catchAll = require("./middlewares/catchAll");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./utils/dbConnection");
const credentials = require("./middlewares/credentials");
// const verifyJWT = require("./middlewares/verifyJWT");
// const verifyRoles = require("./middlewares/verifyRoles");
// const { ROLES_LIST } = require("./utils/config");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(credentials);
app.use(useCors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/logout", require("./routes/logout"));
app.use("/v1/refresh", require("./routes/refresh"));
app.use("/v1/login", require("./routes/login"));
app.use("/v1/register", require("./routes/register"));
app.use("/v1/verify", require("./routes/verify"));
app.use("/v1/reset-password", require("./routes/reset"));
app.use("/v1/forgot-password", require("./routes/forgot-password"));

app.all("*", catchAll);

app.use(errorHandler);

connectDB().then((connection) => {
  if (connection) {
    app.listen(PORT, () => {
      console.log(`app running on port ${PORT}`);
    });
  }
});
