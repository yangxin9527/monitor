# Monitor

前端埋点监控 SDK，一款开箱即用的前端报错监控的埋点 SDK。仅需开发埋点接口即可监控收集整个前端项目在运行的时候产生的 js 内部报错，资源加载异常，接口返回报错，样式丢失的问题。

项目在 SDK 内监听全局 error 错误信息，ajax 错误信息，以及监听资源加载，在页面出现报错的情况下直接向埋点接口上报错误信息，监控前端项目的稳定性。

## 设计目的

1.方便更多的前端开发快速接入前端埋点。

2.为更多中小型的项目增加前端的报错监控。

![Monitor](https://github.com/MriLiuJY/monitorFE/blob/master/docs-image/Monitor.gif "Monitor")
![Monitor](https://github.com/MriLiuJY/monitorFE/blob/master/docs-image/demo.jpg "Monitor")

## 使用

### 配置项

用于传入 `initMonitor` 的配置项。

| 属性    | 参数    | 默认值 | 可选值 | 说明                     |
| :------ | :------ | :----- | :----- | ------------------------ |
| url     | String  | -      | -      | 埋点上报 url 地址        |
| user_id | String  | -      | -      | 用户标识                 |
| record  | Boolean | false  | -      | 是否录制用户操作用于回放 |

### 创建/引入

```
<script>
var script = document.createElement("script");
script.crossOrigin = "anonymous";
script.src = `https://test.com/monitor.1.0.2.js`;
document.body.appendChild(script);
script.addEventListener('load', (e) => {
    window._monitor.init({
        url: "http://localhost:3001/reportData",
        record: true,
        id: "test_id",
    });
});
</script>
```

### 销毁实例/移除所有监听

```
window._monitor.destroy();
```

### 本地测试模拟

前提：开发环境需要 node 版本 18+，安装 mongoDB

1. 克隆仓库，安装依赖
2. npm start //开启前端
3. npm server //开启后端

说明：

http://localhost:3000/ 模拟错误页面，请求会发送给 3001 记录
http://localhost:3001/ 监控后台，查看具体报错和回放
