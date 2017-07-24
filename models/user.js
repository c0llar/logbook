const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { sha256 } = require('../lib/helpers')

const userSchema = new Schema({
  password: { type : String , unique : true, required : true }
})

userSchema.pre('save', function(next) {
  this.password = sha256(this.password)
  next()
})

userSchema.pre('find', function(next) {
  this.where('password', sha256(this.getQuery().password))
  next()
})

userSchema.pre('findOne', function(next) {
  this.where('password', sha256(this.getQuery().password))
  next()
})

module.exports = mongoose.model('User', userSchema)

