/**
 * @file user account connect DB init js
 * @author  yx
 * @version 0.0.1
 */

const mongoose = require("mongoose");

const db = "mongodb://localhost:27017/monitor";

mongoose.Promise = global.Promise;

exports.connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("disonnected", () => {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  mongoose.connection.on("err", (err) => {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  mongoose.connection.on("open", () => {
    console.log("Mongoodb connect done!");
  });
};


exports.save = () => {
  const Cat = mongoose.model("Cat", { name: String });
  const kitty = new Cat({ name: "Zildjian" });
  kitty.save().then(() => console.log("meow"));
};
