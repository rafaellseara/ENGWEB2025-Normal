const Edicao = require('../models/Edicao');

exports.getAll = async (req, res) => {
  const filter = req.query.org ? { organizacao: req.query.org } : {};
  const docs = await Edicao.find(filter)
    .select('anoEdicao organizacao vencedor')
    .lean();
  const result = docs.map(d => ({
    anoEdicao: d.anoEdicao,
    organizador: d.organizacao,
    vencedor: d.vencedor
  }));
  res.json(result);
};

exports.getById = async (req, res) => {
  const ed = await Edicao.findById(req.params.id).lean();
  if (!ed) return res.status(404).json({ error: 'Edição não encontrada' });
  res.json(ed);
};

exports.create = async (req, res) => {
  try {
    const newEd = await Edicao.create(req.body);
    res.status(201).json(newEd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Edicao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Edição não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const del = await Edicao.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: 'Edição não encontrada' });
  res.json({ message: 'Edição eliminada', id: req.params.id });
};