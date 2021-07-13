const express = require('express');
const route = express.Router()
const controller=require('../controller/controller')

route.post('/stocks', controller.createItem);
route.get('/stocks', controller.getItem);
route.put('/stocks/:id', controller.updateItem);
route.delete('/stocks/:id', controller.deleteItem);

module.exports = route