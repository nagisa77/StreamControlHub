const express = require('express');
const app = express();
const port = 3000;

// 使用 Express 内置的中间件来解析 JSON 请求体
app.use(express.json());

// 用于存储会议信息的数据结构
let meetings = {};

// 快速创建会议
app.post('/quick_meeting', (req, res) => {
    const meetingId = Math.random().toString().slice(2, 8);
    meetings[meetingId] = { users: {} };

    console.log(`quick meeting:  ${meetingId}`);
    res.json({ "meeting_id": meetingId });
});


// 加入会议的路由
app.post('/join_meeting', (req, res) => {
    const user_id = req.body.user_id;
    const meeting_id = req.body.meeting_id;

    console.log(`join meeting: user_id: ${user_id}, meeting_id: ${meeting_id}`);

    const JOIN_MEETING_SUCCESS = 0;
    const JOIN_MEETING_FAILURE = 1;

    if (meeting_id in meetings) {
      res.json({ 
        "result": JOIN_MEETING_SUCCESS,
        "msg": "join meeting success" 
      });
    } else {
      res.json({ 
        "result": JOIN_MEETING_FAILURE,  
        "msg": "join meeting failed" 
      });
    }
});


// 用户状态更新
app.post('/user_status', (req, res) => {
    const { meetingId, userId, status } = req.body;
    // 更新用户状态逻辑
    // ...
    res.json({ message: 'Status updated' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
