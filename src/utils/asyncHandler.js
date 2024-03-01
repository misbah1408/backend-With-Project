const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

// other method using try catch

// const asyncHandler = (fn) => async(req, res, next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(err.code ||  500).json({
//             status: 'fail',
//             message: err.message
//         })
//         }
// }
