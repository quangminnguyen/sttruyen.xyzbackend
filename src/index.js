const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/index');

dotenv.config();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:{

    }
}));

const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors:{
        origin:[],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

let users = [];
io.on('connection',socket => {

})

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
})
    .then(res => {
        console.log('connected to database')
    })
    .catch(err => {
        console.log(`your error :${err}`)
    });

const PORT = process.env.PORT || 5000;

router(app);

http.listen(PORT,() => {
    console.log('connected to port 5000')
});
