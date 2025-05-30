const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
  id:        { type: String, required: true },
  link:      { type: String, required: true },
  título:    { type: String, required: true },
  país:      { type: String, required: true },
  compositor:{ type: String },
  intérprete:{ type: String, required: true },
  letra:     { type: String }
}, { _id: false });

module.exports = MusicaSchema;
