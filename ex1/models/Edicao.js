const mongoose = require('mongoose');
const MusicaSchema = require('./Musica');

const EdicaoSchema = new mongoose.Schema({
  _id:        { type: Number },
  anoEdicao:  { type: String, required: true },
  musicas:    { type: [MusicaSchema], default: [] },
  organizacao:{ type: String, required: true },
  vencedor:   { type: String }
}, { collection: 'edicoes' });

module.exports = mongoose.model('Edicao', EdicaoSchema);
