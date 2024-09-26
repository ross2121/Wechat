import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import connectDB from "./db/connect.js";
import userroute from "./routes/auth.js";
// import sodium from "libsodium-wrappers";
import Customer from "./models/customer.js";
import { encryptedmessage } from "./middleware/encrytion.js";

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
app.use("/api", userroute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);
    
    socket.on('joinRoom', (uid) => {
        socket.join(uid);
        console.log(`${socket.id} joined room ${uid}`);
    });

    socket.on('sendMessage', async (data) => {
        const { senderUid, receiverUid, message } = data;
        // console.log(senderUid);
        // console.log(receiverUid);
        try {
            const sender = await Customer.findOne({ uid: senderUid });
            const receiver = await Customer.findOne({ uid: receiverUid });
console.log(sender);
console.log(receiver);
            if (!sender || !receiver) {
                return socket.emit('error', 'Sender or receiver not found');
            }
            const Finalpublickey=Buffer.from(sender.publickey, 'base64')
            const encryptedMsg = await encryptedmessage(Finalpublickey, message);
           
            if (typeof encryptedMsg !== 'string') {
                throw new Error("Encrypted message is not a string");
            }
            console.log(encryptedMsg);
            // Create the new message object
            const newMessage = {
                senderUid,
                receiverUid,
                sendermessages: [encryptedMsg],
                receivermessages: [encryptedMsg]
            };

            sender.messages.push(encryptedMsg);
            receiver.messages.push(encryptedMsg);
    
            // Save the updated sender and receiver
            await sender.save();
            await receiver.save();

            io.to(senderUid).emit('receiveMessage', encryptedMsg);
            io.to(receiverUid).emit('receiveMessage', encryptedMsg);
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit('error', 'Error sending message');
        }
    });
    
    

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

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
