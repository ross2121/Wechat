export function localvariable(req,res,next){
    res.app.locals={
        otp:null,
        resetsession:false,
    }
    next();
}