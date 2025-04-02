const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
require("./utils/connectDB")();
const { errorHandler } = require("./middlewares/errorMiddleware");
const app = express();
const PORT = process.env.PORT || 8090;

//MiddleWares:
app.use(express.json()); //pass incoming json data
app.use(cookieParser()); //pass cookie automatically
//Routes:
app.use("/api/v1/users", usersRouter);

//Error Handler:
app.use(errorHandler);

//start the server:
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
