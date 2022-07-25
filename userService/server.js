const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.port || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', (req, res, next) => {
    return res.status(200).json({ msg: 'Welcome from userService' });
})

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server is running on port ${PORT}`);
})