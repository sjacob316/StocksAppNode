const mongoose = require('mongoose');

const SavedStocksSchema = new mongoose.Schema({
    stockSymbol: { type: String }
})

const RegisterUserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    savedStocks: [{type: String}]    
}, { collection: "Users"})

const model = mongoose.model("RegisterUser", RegisterUserSchema)

module.exports = model;

// export default mongoose.model("RegisterUser", RegisterUserSchema)