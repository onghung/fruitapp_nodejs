const express = require('express');
const {addCart, 
        getAllCart,
        getCart,
        deleteCart,
        updateCart} = require('../controllers/cartController');

const router = express.Router();

router.post('/Cart', addCart);
router.get('/Cart', getAllCart);
router.get('/Cart/:id', getCart);
router.put('/Cart/:id', updateCart);
router.delete('/Cart/:id', deleteCart);


module.exports = {
    routes: router
}