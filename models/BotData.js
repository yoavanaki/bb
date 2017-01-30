const mongoose = require('mongoose');

const botDataSchema = new mongoose.Schema({
  name: String,
  subtitle: String,
  url: String,
  img: String,
  site: String,
  category: String,
  rank: Number,
  change: { type: Number, default: 0 },
  job: Number
}, { timestamps: true });

const BotData = mongoose.model('BotData', botDataSchema);

module.exports = BotData;
