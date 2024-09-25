const express = require('express');
const router = express.Router();
const controller = require("../controllers/controller");

router.get('/', controller.listAll);
router.get('/insert', controller.insertForm);
router.post('/insert', controller.insertData);
router.get('/edit/:id', controller.listOne);
router.get('/delete/:id', controller.delete);
router.post('/update', controller.update);
// router.get('/search?:name', controller.search);

// router.get('/delete/:id', controller.delete);
// router.get('/edit/:id', controller.editForm);
// router.post('/update', controller.update);

module.exports = router