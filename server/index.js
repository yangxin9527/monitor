const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
// 创建 Express 应用
const app = express();
const port = 3001;
app.use(express.static("./"));

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
const jsonSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// 创建模型
const JsonData = mongoose.model("JsonData", jsonSchema);

// 中间件
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});


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
// 获取报错数据
app.post("/getData", async (req, res) => {
  try {
    const latestRecord = await JsonData.findOne().sort({ createdAt: -1 }).exec();
    console.log(latestRecord);
    res.status(201).send(latestRecord || {});
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});


// 定义分页查询函数
async function paginateUsers(page, pageSize) {
  try {
    // 计算总条目数
    const totalItems = await JsonData.countDocuments();

    // 计算总页数
    const totalPages = Math.ceil(totalItems / pageSize);

    // 查询当前页的数据
    const data = await JsonData.find()
      .skip((page - 1) * pageSize) // 跳过前 (page - 1) * pageSize 条数据
      .limit(pageSize) // 取 pageSize 条数据
      .exec(); // 执行查询

    // 返回分页结果
    return {
      data,
      currentPage: page,
      totalPages,
      pageSize,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    throw error;
  }
}


app.get("/getReports", async (req, res) => {
  try {
    // 测试分页函数
    console.log(req.body);
    const { page = 1, pageSize = 3 } = req.query;
    const latestRecord = await paginateUsers(page, pageSize);

    // console.log(latestRecord);
    res.status(201).send(latestRecord || {});
  } catch (error) {
    res.status(500).send("Error saving data");
  }
});

// 计算过去 30 天的时间范围
const now = new Date();
const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

async function aggregateLogsByDay(timeGranularity = "day") {
  try {
    const result = await JsonData.aggregate([
      {
        $match: {
          createdAt: {
            $gte: past30Days,
            $lt: now,
          },
        },
      },

      {
        $group: {
          _id: timeGranularity === "minute"
            ? {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              hour: { $hour: "$createdAt" },
              minute: { $minute: "$createdAt" },
              type: "$type", // 按类型分组
            }
            : {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              type: "$type", // 按类型分组
            },

          count: { $sum: 1 }, // 统计每个分组的记录数
        },
      },
      {
        $group: {
          _id: timeGranularity === "minute"
            ? {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
              hour: "$_id.hour",
              minute: "$_id.minute",

            } : {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          types: {
            $push: {
              type: "$_id.type",
              count: "$count",
            },
          },
          total: { $sum: "$count" }, // 每天的总数
        },
      },
      {
        $sort: timeGranularity === "minute"
          ? {
            "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1, "_id.minute": 1,
          }
          : { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error aggregating logs:", error);
  }
}


app.get("/eChart", async (req, res) => {
  try {
    // 测试分页函数
    // console.log(req.body);
    const { type = "day" } = req.query;


    const result = await aggregateLogsByDay(type);

    console.log(result);
    // console.log(latestRecord);
    res.status(201).send(result || []);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data");
  }
});


// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
