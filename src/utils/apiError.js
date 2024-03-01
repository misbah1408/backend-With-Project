class apiError extends Error{
    constructor(
        statusCode,
        message = 'An error occurred',
        errors=[],
        statck=""
    ){
        super(message);
        this.statusCode=statusCode;
        this.data= null,
        this.message =  message, 
        this.success = false,
        this.errors= errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default apiError