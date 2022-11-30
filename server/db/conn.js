const mongoose = require("mongoose");
const p = require("../utils/P");
const MongoDB_Server = () => {
  try {
    mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      appName: "Social Media",
    });
    const database = mongoose.connection;
    database.once("open", () => {
      p(`[ MongoDB Database ]\n\nStatus\t: Connected\n\n[ API Requests ]\n`);
    });
    database.on(
      "error",
      console.error.bind(
        console,
        `[ MongoDB Database ]\n\nStatus\t: Disconnected\n\n[ Error Message ]\n\nConnection error\n\n`
      )
    );
  } catch (error) {
    p(
      `[ MongoDB Database ]\n\nStatus\t: Disconnected\n\n[ Error Message ]\n\n${error?.message}\n\n[ Error Summary ]\n\n${error}\n\n`
    );
    process.exit();
  }
};
module.exports = MongoDB_Server();
