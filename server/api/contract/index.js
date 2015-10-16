'use strict';

var express = require('express');
var controller = require('./contract.controller');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', upload.single('file'), controller.upload);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;