const mongoose = require("mongoose")

const documentSchema = mongoose.Schema({
  title: String,
  author: String,
  contributors: Array,
  createdAt: String,
  updatedAt: String,
  shapes: Array
})

module.exports = documentSchema
