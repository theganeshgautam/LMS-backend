const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  bookName : {
    type: String,
    unique: true
  },
  publishedAt: {
    type: String
  },
  authorName:{
    type: String
  },
  bookPrice : {
    type: Number
  },
  isbnNumber : {
    type: Number
  },
  publication: {
    type: String
  },
  imageUrl:{
    type: String
  }
})

const Book = new mongoose.model('Book', bookSchema);

module.exports= Book;
