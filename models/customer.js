import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderUid: {
        type: String,
        required: true,
    },
    receiverUid: {
        type: String,
        required: true,
    },
    sendermessages: [
        {
            type: String,
            // required: true,
        }
    ],
    receivermessages: [
        {
            type: String,
            // required: true,
        }
    ]
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    contactno: {                    
        type: Number,
        require: true
    },
    email: {
        type: String,
        required: [true, "Please provide emailid"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    uid: {
        type: String,
        require: true,
    },
    keypair: {
        type: String,
        require: true
    },
    publickey: {
        type: String,
        require: true
    },
    privatekey: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: [true, "Please provide password"],
    },
    googleSignIn: {
        type: String,
        default: false,
    },
    role: {
        type: String,
        default: "Customer",
        immutable: true,
    },
    messages: [MessageSchema]  
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
