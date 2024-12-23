const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Refers to the user who is chatting
    required: true
  },
  conversation: [
    {
      query: {
        type: String,
        required: true // User's question
      },
      response: {
        type: String,
        required: true // Bot's answer
      },
      timestamp: {
        type: Date,
        default: Date.now // Time of each chat message
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now // Date of the conversation
  }
});

module.exports = mongoose.model('Chat', ChatSchema);
