var express = require('express');
var router = express.Router();

const multer = require('multer');

var upload = multer({ dest: 'public/files/' });


const productController = require('../controllers/product');

router.post('/create', productController.create);

router.post('/update', productController.update);

router.post('/delete', productController.delete);

router.get('/get', productController.getAll);

router.post('/upload', upload.single('avatar'), productController.upload);

module.exports = router;
