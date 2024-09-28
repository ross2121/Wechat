import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import connectDB from "./db/connect.js"
import Customer from "./models/customer.js";
import { encryptedmessage } from "./middleware/encrytion.js";
import Message from "./models/message.js";
import Userrouter from "./routes/auth.js"
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


 io.on('connection', (socket) => {
    console.log("User connected:", socket.id);
    socket.on('joinRoom', (uid) => {
        socket.join(uid);
        console.log(`${socket.id} joined room ${uid}`);
    });
    socket.on('sendMessage', async (data) => {
        const { senderUid, receiverUid, message: plainMessage } = data;
        console.log("Original message:", plainMessage);
    
        const user = await Customer.findOne({ uid: receiverUid });

        const encryptedMessage = await encryptedmessage(user.publickey, plainMessage);
        console.log("Encrypted message:", encryptedMessage);
             
        try {
            if (senderUid && receiverUid) {
                data.message = encryptedMessage;
                io.to(senderUid).emit('receiveMessage', data);
                io.to(receiverUid).emit('receiveMessage', data);
                const message=new Message({senderUid:senderUid,reciverUid:receiverUid,message:encryptedMessage});
                message.save()
                console.log(`Message sent from ${senderUid} to ${receiverUid}: ${encryptedMessage}`);
            } else {
                socket.emit('error', 'Invalid sender or receiver UID');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});
app.use("/auth",Userrouter);

const start = async () => {
    try {
        mongoose.set("strictQuery", false);
        await connectDB(process.env.MONGO_URL);
        server.listen(port, () => {
            console.log(`Server is running at ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

start();
