const express = require('express');
const { UserReg, saveUserDtls, decodeString } = require('../modules/regApiUser');
const RegApiUser = express.Router();

RegApiUser.get('/newapiuser', (req, res) => {
    UserReg(req, res);
});

RegApiUser.post('/newapiuser', (req, res) => {
    saveUserDtls(req, res);
})

RegApiUser.get('/test', (req, res) => {
    decodeString(req, res);
})

module.exports = { RegApiUser };