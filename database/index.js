const mongoose = require('mongoose');

const ConnectionString = "mongodb+srv://ganesh:ganesh@cluster0.oodepja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function ConnectToDatabase(){
  await mongoose.connect(ConnectionString);
  console.log("mongoose Connected to DB successfully");
}

module.exports = ConnectToDatabase;