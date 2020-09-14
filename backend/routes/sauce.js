const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauce');



router.get('/', auth, stuffCtrl.getAllSauces);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', multer, auth, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;