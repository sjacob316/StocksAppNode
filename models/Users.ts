const mongoose = require('mongoose');

// const MembershipSchema = new mongoose.Schema({
//     provider: { type: String, required: true },
//     providerUserId: { type: String },
//     password: { type: String },
//     dateAdded: { type: Date, default: Date.now() }
// }, { collection: "MembershipAccounts" })

const UserSchema = new mongoose.Schema({
    provider: { type: String, required: true },
    providerUserId: { type: String },
    password: { type: String },
    dateAdded: { type: Date, default: Date.now() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },    
    savedStocks: [{type: String}]    
}, { collection: "Users"} )

// const membership = new mongoose.model("Membership", MembershipSchema);
const userInfo = mongoose.model("User", UserSchema);

module.exports = userInfo