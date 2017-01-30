const mongoose = require('mongoose');

const scrapeJobSchema = new mongoose.Schema({
  site: String,
  category: String,
  url: String,
  number: Number,
  items: Number
}, { timestamps: true });

const ScrapeJob = mongoose.model('ScrapeJob', scrapeJobSchema);

module.exports = ScrapeJob;
