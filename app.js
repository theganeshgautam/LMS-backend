const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs= require('fs')
const ConnectToDatabase = require('./database')
const Book = require('./model/bookModel.js')
const {storage, multer} = require('./middleware/multerConfig.js')
const upload = multer({storage: storage}) // creating instance of multer by calling the multer function and and passing it an options object. One of the options we're specifying is storage, which is set to the storage object imported from multerConfig.js. This means that when multer processes file uploads, it will use the storage configuration defined in multerConfig.js.

// cors package
const cors= require('cors')

app.use(cors({
  origin: '*'
}))

app.use(express.json()) //normally express le json parse garna sakdaina or bujhna sakdaina. so this command helps express to understand json

ConnectToDatabase();
 
app.get("/", (req,res)=>{
  res.status(200).json({
    "message": "success",
    "name": "Ganesh Gautam",
    "age":24
  });
})


//post http verb le db ma entry garne ho. so tyo paila chai schema ra model banaune ani yaha post ma aayera create garne. db ma empty column/field dekhaudaina so create nagaresamma dekhaudaina
// create a book
app.post("/book", upload.single('image'), async (req,res)=>{// for multiple files upload, upload.array
  const {bookName, publishedAt, bookPrice, authorName, isbnNumber, publication}= req.body
  // console.log(bookName, bookPrice, authorName)
  console.log(req.file) //for multiple files, req.files
  const imageUrl= "http://localhost:3000/" + req.file.filename;
  await Book.create({
    bookName,
    bookPrice,
    authorName,
    isbnNumber,
    publication,
    publishedAt,
    imageUrl
  })
  res.json({
    message:"book created successfully!"
  })
})


// fetch books
app.get("/book", async (req,res)=>{
  const books = await Book.find()
  res.status(200).json({// returns an array of books/objects
    message: "books fetched successfully",
    data: books
  })
})


// fetch a single book
app.get("/book/:id", async (req,res)=>{
  const id= req.params.id// url bata id aaune vako hunale params.id gareko (body bata aaune nahunale)
  const book= await Book.findById(id)
  if(!book){
    res.json({
      message: "Book not found!"
    })
  }else{
    res.status(200).json({// returns an object i.e a book since we used findById method
      data: book
    })
  }
})


// delete a single book
app.delete("/book/:id", async (req,res)=>{
  const id = req.params.id
  const oldDatas= await Book.findById(id)
  if(oldDatas.imageUrl){
    const oldImgPath = oldDatas.imageUrl
    console.log(oldImgPath)
    const localHostUrlLength= "http://localhost:3000/".length
    const newOldImgPath= oldImgPath.slice(localHostUrlLength)
    console.log(newOldImgPath)
    fs.unlink(`storage/${newOldImgPath}`, (err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("file deleted successfully!")
      }
    })
  }
  await Book.findByIdAndDelete(id)
  res.status(200).json({
    message: "Book deleted successfully!"
  })
})


// update a single book
app.patch("/book/:id", upload.single('image'), async (req,res)=>{
  const id = req.params.id
  const oldDatas= await Book.findById(id)
  let fileName;
  if(req.file){
    const oldImgPath = oldDatas.imageUrl
    const localHostUrlLength= "http://localhost:3000/".length
    const newOldImgPath= oldImgPath.slice(localHostUrlLength)
    fs.unlink(`storage/${newOldImgPath}`, (err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("old file deleted successfully!")
      }
    })
    fileName = "http://localhost:3000/"+ req.file.filename
  }
  const{bookName, bookPrice, authorName, isbnNumber, publication}= req.body
  await Book.findByIdAndUpdate(id, {
    bookName: bookName,
    bookPrice: bookPrice,
    authorName: authorName,
    isbnNumber: isbnNumber,
    publication: publication,
    imageUrl: fileName
  })
  res.status(200).json({
    message: "Book updated successfully!"
  })
})

app.use(express.static("./storage/"))

app.listen(3000, ()=>{
  console.log("nodejs server started at port 3000!")
});


// mongodb+srv://ganesh:ganesh@cluster0.oodepja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://ganesh:<password>@cluster0.oodepja.mongodb.net/