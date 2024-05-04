const multer = require('multer')

const storage= multer.diskStorage({ // so the diskStorage method has 2 props: destination and filename
  
  destination: function(req,file,cb){
    const allowedFileTypes = ["image/png", "image/jpeg", 'image/jpg']
    if(!allowedFileTypes.includes(file.mimetype)){
      cb(new Error("this filetype is not supported!"))
      return
    }
    if(file.size>1000000){
      cb(new Error("this filesize is greater than 1mb"))
      return
    }
    cb(null, './storage') // --> cb(error,success) cb vaneko callback func. and takes error,success
  },
  filename: function(req,file,cb){
    cb(null,Date.now()+ "-"+ file.originalname)
  }
})

module.exports={
  storage, 
  multer
}