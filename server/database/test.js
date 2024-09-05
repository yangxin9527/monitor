// 引入mongoose模块
const mongoose = require("mongoose");

// 连接到MongoDB数据库
// 这里假设MongoDB运行在默认端口27017上，并且没有设置密码
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 连接成功后的回调函数
mongoose.connection.once("open", function () {
  console.log("Connected to MongoDB successfully.");
});

// 连接失败后的回调函数
mongoose.connection.on("error", function (err) {
  console.error("MongoDB connection error: " + err);
});

// 定义一个简单的模型
const Schema = mongoose.Schema;

const CatSchema = new Schema({
  name: String,
  color: String,
  legs: Number,
});

// 创建一个模型
const Cat = mongoose.model("Cat", CatSchema);

// 创建一个新的Cat实例
const silence = new Cat({
  name: "Silence",
  color: "Black",
  legs: 4,
});

// 将Cat实例保存到数据库
silence.save(function (err, cat) {
  if (err) return console.error(err);
  console.log("Cat saved to database: ", cat);
});

// 查询数据库中所有的Cat
Cat.find({}, function (err, cats) {
  if (err) return console.error(err);
  console.log("Cats in database: ", cats);
});
