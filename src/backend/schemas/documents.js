const mongoose = require("mongoose")

const documentSchema = mongoose.Schema({
  title: String,
  author: String,
  contributors: Array,
  createdAt: String,
  updatedAt: String,
  shapes: Array
})

documentSchema.set('toJSON', {
  versionKey:false,
  virtuals: true,
  transform: function (doc, ret) {   delete ret._id  }
});

module.exports = documentSchema
