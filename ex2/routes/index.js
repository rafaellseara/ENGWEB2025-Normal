const express = require('express');
const router = express.Router();
const axios = require('axios');

// Base da API existente
const API_BASE = 'http://localhost:25000';

// Página principal
router.get('/', async (req, res, next) => {
  try {
    const resp = await axios.get(`${API_BASE}/edicoes`);
    const edicoes = resp.data;
    res.render('index', { title: 'Eurovisão - Edições', edicoes });
  } catch (err) {
    next(err);
  }
});

// Página de edição
router.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const resp = await axios.get(`${API_BASE}/edicoes/${req.params.id}`);
    const ed = resp.data;
    res.render('edicao', { title: `Edição ${ed._id}`, ed });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).send('Edição não encontrada');
    }
    next(err);
  }
});

// Página de país
router.get('/paises/:pais', async (req, res, next) => {
  try {
    const pais = req.params.pais;

    // Obter todas as edições
    const allEdicoesResp = await axios.get(`${API_BASE}/edicoes`);
    const edAll = allEdicoesResp.data;

    // Participações como intérprete
    const participacoes = [];
    for (let ed of edAll) {
      const detalhesResp = await axios.get(`${API_BASE}/edicoes/${ed.anoEdicao}`);
      const detalhes = detalhesResp.data;
      detalhes.musicas.forEach(m => {
        if (m.país === pais) {
          participacoes.push({
            id: detalhes._id,
            ano: detalhes.anoEdicao,
            titulo: m.título,
            interprete: m.intérprete,
            venceu: detalhes.vencedor === pais
          });
        }
      });
    }

    // Edições organizadas pelo país
    const orgResp = await axios.get(`${API_BASE}/paises?papel=org`);
    const orgs = orgResp.data;
    const orgEntry = orgs.find(o => o.pais === pais) || { anos: [] };

    res.render('pais', {
      title: `País: ${pais}`,
      pais,
      participacoes,
      organizou: orgEntry.anos
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
