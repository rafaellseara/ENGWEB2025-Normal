const Edicao = require('../models/Edicao');

exports.getPaises = async (req, res) => {
  const papel = req.query.papel;
  if (papel === 'org' || papel === 'venc') {
    const field = papel === 'org' ? 'organizacao' : 'vencedor';
    const agg = await Edicao.aggregate([
      { $group: { _id: `$${field}`, anos: { $push: '$anoEdicao' } } },
      { $sort: { _id: 1 } }
    ]);
    return res.json(agg.map(p => ({ pais: p._id, anos: p.anos })));
  }
  res.status(400).json({ error: 'Parâmetro papel inválido' });
};

exports.getInterpretes = async (req, res) => {
  const agg = await Edicao.aggregate([
    { $unwind: '$musicas' },
    { $group: { _id: { nome: '$musicas.intérprete', pais: '$musicas.país' } } },
    { $sort: { '_id.nome': 1 } }
  ]);
  res.json(agg.map(i => ({ interprete: i._id.nome, pais: i._id.pais })));
};