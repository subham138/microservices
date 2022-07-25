const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { mainRouter } = require('./routes');
const buffer = require('buffer');
// const buffer = require('buffer');

const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use('/', (req, res, next) => {
//     return res.status(200).json({ msg: 'Welcome from mainService' });
// })

global.userDetails

app.use((req, res, next) => {
    var auth_key = req.headers.auth_key;
    // if (req.path.split('/')[1] != 'err') {
    if (auth_key == '' || auth_key == null || auth_key == undefined || !auth_key) {
        // res.redirect('/err');
        // res.json();
        res.json({ status: 0, message: 'Please provide auth key to access the API' })
        // }
    } else {
        var buffer_obj = Buffer.from(auth_key, "base64");
        var real_str = buffer_obj.toString("utf8")
        var data = real_str.split('##')[1]
        global.userDetails = data
        next()
    }
})

app.use(mainRouter)

app.get('/fetch', (req, res, next) => {
    console.log(userDetails);
    var auth_key = req.headers.auth_key;
    res.status(200).json({ msg: auth_key });
})

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server is running on port ${PORT}`);
})