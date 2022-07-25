const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const path = require('path');
const { RegApiUser } = require('./routes');

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.use((req, res, next) => {

// })


// app.use((req, res, next) => {
//     var auth_key = req.headers.auth_key;
//     // if (req.path.split('/')[1] != 'err') {
//     if (auth_key == '' || auth_key == null || auth_key == undefined || !auth_key) {
//         // res.redirect('/err');
//         res.json({ status: 0, message: 'Please provide auth key to access the API' });
//         // }
//     }
//     next();
// })

app.use('/main', proxy('http://localhost:3001'));
app.use('/user', proxy('http://localhost:3002'));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(RegApiUser);

app.get('/', (req, res, next) => {
    res.render('reg');
    // res.status(200).json({ msg: 'Welcome from indexService' });
})

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server is running on port ${PORT}`);
})