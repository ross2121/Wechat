import mongoose from "mongoose";

const Message=new mongoose.Schema({
    senderuid:{
        type:String,
        require:true,
    },
    reciveruid:{                    
        type:Number,
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
