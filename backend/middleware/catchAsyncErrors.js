module.exports = (theFunc) =>(req,ress,next)=>{
  Promise.resolve(theFunc(req,ress,next)).catch(next);
}