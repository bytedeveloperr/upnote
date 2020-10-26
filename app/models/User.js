const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }],

  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, { timestamps: true })

module.exports = model('User', UserSchema)
