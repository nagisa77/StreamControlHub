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
        if (user_id in meetings[meeting_id].users) {
            res.json({ 
                "result": JOIN_MEETING_FAILURE,
                "msg": `user "${user_id}" is already in meeting`
            });
        } else {
            meetings[meeting_id].users[user_id] = {
                is_video_on: false,
                video_stream_id: "",
                is_audio_on: false,
                audio_stream_id: "",
                is_screen_on: false, 
                screen_stream_id: ""
            };

            res.json({ 
                "result": JOIN_MEETING_SUCCESS,
                "msg": `join meeting success`
            });
        }
    } else {
        res.json({ 
            "result": JOIN_MEETING_FAILURE,  
            "msg": `meeting not exists: ${meeting_id}`            
        });
    }
});

// 用户请求音视频权限
app.post('/request_up_stream', (req, res) => {
    const user_id = req.body.user_id;
    const meeting_id = req.body.meeting_id;
    const media_type = req.body.media_type;

    const REQUEST_UP_STREAM_SUCCESS = 0;
    const REQUEST_UP_STREAM_FAILURE = 1;

    console.log(`request_up_stream: user_id: ${user_id}, meeting_id: ${meeting_id}, media_type: ${media_type}`);

    if (meeting_id in meetings) {
        if (user_id in meetings[meeting_id].users) {
            res.json({ 
                "result": REQUEST_UP_STREAM_SUCCESS,
                "msg": "request up stream success" 
            });
      } else {
        res.json({ 
            "result": REQUEST_UP_STREAM_FAILURE,  
            "msg": `user not exist: ${user_id}` 
        });
      }
    } else {
        res.json({ 
            "result": REQUEST_UP_STREAM_FAILURE,  
            "msg": `meeting not exists: ${meeting_id}`      
        });
    }
});

// 请求用户状态
app.post('/request_user_status', (req, res) => {
    const meeting_id = req.body.meeting_id;    
    const REQUEST_USER_STATUS_SUCCESS = 0;
    const REQUEST_USER_STATUS_FAILURE = 1;
    if (meeting_id in meetings) {
        res.json({ 
            "result": REQUEST_USER_STATUS_SUCCESS,  
            "msg": `request user status success`,
            "user_list": meetings[meeting_id].users
        });
    } else {
        res.json({ 
            "result": REQUEST_USER_STATUS_FAILURE,  
            "msg": `meeting not exists: ${meeting_id}`      
        });
    }
});

// 用户状态更新
app.post('/user_status', (req, res) => {
    const { meeting_id, user_id, is_audio_on, is_video_on, is_screen_on, audio_stream_id, video_stream_id, screen_stream_id } = req.body;

    const UPDATE_USER_STATUS_SUCCESS = 0; 
    const UPDATE_USER_STATUS_MEETINGNOT_EXISTS = 1; 
    const UPDATE_USER_STATUS_USEE_NOT_EXISTS = 2; 
    if (meeting_id in meetings) {
        if (user_id in meetings[meeting_id].users) {
            var user = meetings[meeting_id].users[user_id]; 
            user.is_audio_on = is_audio_on;
            user.is_video_on = is_video_on;
            user.is_screen_on = is_screen_on;
            user.audio_stream_id = audio_stream_id;
            user.video_stream_id = video_stream_id;
            user.screen_stream_id = screen_stream_id;

            res.json({ 
                "result": UPDATE_USER_STATUS_SUCCESS,  
                "msg": `update user status success ${user_id}`      
            });
        } else {
            res.json({ 
                "result": UPDATE_USER_STATUS_USEE_NOT_EXISTS,  
                "msg": `user not exists: ${user_id}`      
            });
        }
    } else {
        res.json({ 
            "result": UPDATE_USER_STATUS_MEETINGNOT_EXISTS,  
            "msg": `meeting not exists: ${meeting_id}`      
        });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
