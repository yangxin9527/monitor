const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// 创建 Express 应用
const app = express();
const port = 3001;


app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild",
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});
// 连接到 MongoDB
mongoose.connect("mongodb://localhost:27017/dataReport", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义数据模型
const Schema = mongoose.Schema;

// 创建不严格的 Schema
const jsonSchema = new mongoose.Schema({}, { strict: false });

// 创建模型
const JsonData = mongoose.model("JsonData", jsonSchema);

// 中间件
app.use(bodyParser.json());

// POST 接口
app.post("/reportData", async (req, res) => {
  try {
    const data = new JsonData(req.body);
    await data.save();
    res.status(201).send("Data saved");
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});
app.post("/getData", async (req, res) => {
  try {
    const latestRecord = await JsonData.findOne().sort({ createdAt: -1 }).exec();
    console.log(latestRecord);
    res.status(201).send(latestRecord || {});
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
