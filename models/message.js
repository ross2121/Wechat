import mongoose from "mongoose";

const Message=new mongoose.Schema({
    senderUid:{
        type:String,
        require:true,
    },
    reciverUid:{                    
        type:String,
        require:true
    },
    message:{
        type:String,
        default:"",
        require:true
    },
    },
    {timestamps:true}
)
export default mongoose.model('Message',Message);
