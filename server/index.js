const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const p = require("./utils/P");
const Time = require("./utils/time");
const { notFound, errorHandler } = require("./middlewares/error");

// @server --routes
const user_routes = require("./routes/user_routes");
const chat_routes = require("./routes/chat_routes");
const image_routes = require("./routes/image_routes");
const message_routes = require("./routes/message_routes");
const post_routes = require("./routes/post_routes");
const misc_routes = require("./routes/misc_routes");

// @server --cofiguration
require("dotenv").config();
const PORT = process.env.PORT;
__dirname = path.resolve();
const sessionConfig = {
  secret: process.env.SECRET_KEY,
  name: "Social Media",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: true,
  },
};

// @server --mongodb
require("./db/conn");

app.use(
  express.json({
    limit: "30mb",
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: "30mb",
    extended: true,
  })
);
app.use(session(sessionConfig));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));

app.use("/api/u", user_routes);
app.use("/api/p", post_routes);
app.use("/api/i", image_routes);
app.use("/api/c", chat_routes);
app.use("/api/me", message_routes);
app.use("/api/mi", misc_routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.use(
    "/",
    express.Router().get("/", (req, res) => {
      res.status(200).json("Social Media Platform -- Server");
    })
  );
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  p(
    `\n\n[ Node Server ]\n\nUrl\t: http://localhost:${PORT}\nTime\t: ${Time()}\n`
  );
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connected", (socket) => {
  p(`\n\n[ Web Socket ]\n\nStatus\t: Connected\n\nSocket\t: ${socket}\n\n`);
  try {
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessageRecieved) => {
      let chat = newMessageRecieved.chat;
      if (!chat.users) {
        console.log(` -------------------------------------------------`);
        console.log(
          `file: index.js : line 135 : socket.on : new message --No_Chat_Users`
        );
        console.log(` -------------------------------------------------`);
      }
      chat.users.forEach((user) => {
        const id = user._id;
        if (id === newMessageRecieved.sender._id) {
          return;
        }
        socket.in(id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", () => {
      p(`\n\n[ Web Socket ]\n\nStatus\t: Disconnected\n\n`);
      socket.leave(userData._id);
    });
  } catch (error) {
    console.log(` ------------------------------------------------`);
    console.log(`file: index.js : line 154 : io.on : error`, error);
    console.log(` ------------------------------------------------`);
  }
});
