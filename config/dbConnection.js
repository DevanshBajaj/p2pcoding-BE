const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => {
    throw new Error("Error connecting to db: ", err)
})
