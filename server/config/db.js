const mongoose = require("mongoose");

const URI= process.env.MONGODB_URI;



const connectDb= async()=> {
    try {
        await mongoose.connect(URI);
        console.log('connection succesfull to database');

    } catch (error) {
        console.log(`Error connecting to the database ${error.message}`);
        process.exit(0);
    }
}
module.exports=connectDb;
