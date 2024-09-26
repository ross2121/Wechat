import { StatusCodes } from "http-status-codes";


export const errorhandlerMiddlerwarew=(err,req,res,next)=>{
    const defaulterror={
       statuscode:err.statuscode||StatusCodes.INTERNAL_SERVER_ERROR,
       msg:err.message||"Something went wrong"   
    }
    if(err.name==="validationerror"){
        defaulterror.msg=Object.values(err.errors)
        .map((item)=>item.message)
        .join(',');
    }
    res.status(defaulterror.statuscode).json({msg:defaulterror.msg});
}