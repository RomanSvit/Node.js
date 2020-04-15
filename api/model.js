const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const contactSchema = new Schema({
name: {type:String, required: true},
email: {type: String, required: true},
phone: {type: String, required: true}
})

const contactModel = mongoose.model("ContactModel", contactSchema);
module.exports = contactModel;