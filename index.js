'use strict'
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')
const fruitRouter = require('./routes/fruit-routes')
const cartRouter = require('./routes/cart-routes')
const paypal = require('./services/paypal');
const firebase = require('./db')
const firestore = firebase.firestore();
const admin = require('firebase-admin')
const credentials = require('./serviceAcountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials)
  });



const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/signup', async (req, res) => {
    console.log(req.body);
    const user = {
      email: req.body.email,
      password: req.body.password
    };
    try {
      const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
      });
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/signin', async (req, res) => {
    console.log(req.body);
    const user = {
      email: req.body.email,
      password: req.body.password
    };
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
      const idToken = await userCredential.user.getIdToken();
      res.json({ idToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.use('/api', fruitRouter.routes)
app.use('/api', cartRouter.routes)

app.get('/pay', async(req, res) => {
    try{
        const url = await paypal.createOrder();
        res.send(url);
    }catch(err){
        res.send('ERROR: ' + err)
    }
})

app.get('/complete-order', async (req, res) => {
    try {
        await paypal.capturePayment(req.query.token)

        const data = {
            active: true,
            account: 'hung@gmail.com'
        };
        const docRef = await firestore.collection('active').add(data);

        res.send('Hoàn thành đơn hàng')
    }catch(err){
        res.send('ERROR: ' + err)
    }
})

app.get('/cancel-order', (req, res) => {
    res.send("Cancel Order")
})

app.listen(config.port, () => console.log('listening on port ' + config.port))
