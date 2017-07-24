const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  belongsTo: String,
  createdAt: Number,
  date: Number,
  title: String,
  text: String
})

noteSchema.pre('save', function(next) {
  this.createdAt = Date.now()
  next()
})

module.exports = mongoose.model('Note', noteSchema)

