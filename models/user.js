const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); // Apply the plugin to the schema

// module.exports = mongoose.model("user", userSchema);
module.exports = mongoose.model("User", userSchema);