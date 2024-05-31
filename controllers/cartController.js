'use strict'

const { model } = require('mongoose');
const firebase = require('../db')
const Cart = require('../models/cart');
const firestore = firebase.firestore();


const addCart = async (req, res, next) => {
    try {
        const data = req.body;
        const cart = await firestore.collection('cart').doc().set(data)
        res.send('Record saved successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const getAllCart = async (req, res, next) => {
    try {
        const cartRef = firestore.collection('cart');
        const snapshot = await cartRef.where('user', '==', 'test@gmail.com').get(); // Lọc giỏ hàng theo user = email người dùng đã đăng nhập
        const cartsArray = [];

        if (snapshot.empty) {
            return res.status(404).send('Không tìm thấy giỏ hàng');
        } else {
            snapshot.forEach(doc => {
                const cart = new Cart(
                    doc.data().datetime, 
                    doc.data().name, 
                    doc.data().price, 
                    doc.data().quantity, 
                    doc.data().status, 
                    doc.data().user,
                    doc.data().imgurl
                );
                cartsArray.push(cart); 
            });
            return res.send(cartsArray);
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
}


const getCart = async (req, res, next) => {
    try {
        const id = req.params.id;
        const cart = await firestore.collection('cart').doc(id);
        const data = await cart.get();
        if(!data.exists) {
            res.status(404).send('Cart with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateCart = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const cart =  await firestore.collection('cart').doc(id);
        await cart.update(data);
        res.send('cap nhat thanh cong');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteCart = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('cart').doc(id).delete();
        res.send('xoa thanh cong');
    } catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports = {
    addCart,
    getAllCart,
    getCart,
    updateCart,
    deleteCart
}