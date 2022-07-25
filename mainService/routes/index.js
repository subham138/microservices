const express = require('express')
const mainRouter = express.Router()
const mysql = require('mysql')
const { connect_db } = require('../modules/db')

mainRouter.post('/fetch', async (req, res) => {
    var data = JSON.parse(userDetails)
    var db_dt = data.db_host.split(':')

    const db = await connect_db('103.27.86.49', db_dt[1], data.db_user, data.db_pass, data.db_name)

    // var db = mysql.createConnection({
    //     host: '103.27.86.49',//db_dt[0],
    //     port: db_dt[1],
    //     user: data.db_user,
    //     password: data.db_pass,
    //     database: data.db_name,
    //     queryTimeout: 6000,
    //     connectTimeout: 60000
    // })
    // db.connect(function (err) {
    //     if (err) throw err;
    // });
    var req_data = req.body,
        res_data = '';
    var select = req_data.select, table_name = req_data.table_name, whr = req_data.where ? `WHERE ${req_data.where}` : '', order = req_data.order ? req_data.order : '';
    let sql = `SELECT ${select} FROM ${table_name} ${whr} ${order}`;
    db.query(sql, (err, result) => {
        if (err) res_data = { suc: 0, msg: JSON.stringify(err) }
        else res_data = { suc: 1, msg: result }
        res.status(200).json(res_data)
    })
    // console.log(res_data);
})

mainRouter.post('/insert', (req, res) => {

})

module.exports = { mainRouter }