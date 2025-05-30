const express = require('express');
const router = express.Router();
const edicaoCtrl = require('../controllers/edicao');
const musicaCtrl = require('../controllers/musica');

// Rotas para edições
router.get('/edicoes', edicaoCtrl.getAll); 
router.get('/edicoes/:id', edicaoCtrl.getById);
router.post('/edicoes', edicaoCtrl.create);
router.put('/edicoes/:id', edicaoCtrl.update);
router.delete('/edicoes/:id', edicaoCtrl.remove);

// Rotas para países e intérpretes
router.get('/paises', musicaCtrl.getPaises);
router.get('/interpretes', musicaCtrl.getInterpretes);

module.exports = router;