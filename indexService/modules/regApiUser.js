const db = require('./db');
const dateFormat = require('dateformat');
var request = require('request');
const buffer = require('buffer');

const DbDetails = () => {
    var sql = `SELECT id, name FROM md_db_type`;
    var data = '';
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                if (result.length > 0) {
                    data = { suc: 1, msg: result };
                } else {
                    data = { suc: 2, msg: 'No data found' };
                }
            }
            resolve(data);
        })
    })
}

const getMaxId = () => {
    var sql = `SELECT IF(MAX(id) > 0, MAX(id), 0)+1 as id FROM md_user`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) console.log(err);
            else resolve(result[0]);
        })
    })
}

const getServerDetails = () => {
    var data = '';
    var options = {
        'method': 'GET',
        'url': 'https://rpfcoop2.com/process/index.php/api/get_server_details',
        'headers': {
            'Cookie': 'ci_session=orp0jou9tctjsmfqeq48bval1ch6lu98'
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                data = {};
                throw new Error(error);
            } else {
                data = JSON.parse(response.body)
            }
            // console.log(response.body);
            resolve(data);
        });
    })
}

const UserReg = async (req, res) => {
    var db_details = await DbDetails();
    db_details = db_details.msg;
    // console.log(db_details);
    res.render('reg', { db_details });
}

const saveUserDtls = async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var date = dateFormat(new Date(), "yyyy-mm-dd");
    // console.log(data);
    var db_pass = data.db_pass ? data.db_pass : '';
    var serverDetails = await getServerDetails();
    var client_ip = serverDetails.REMOTE_HOST;
    var max_id = await getMaxId();
    var auth_key_str = max_id.id + '##' + JSON.stringify(data) + '##' + date;
    var auth_key = Buffer.from(auth_key_str).toString('base64');
    // console.log(auth_key);
    // console.log(Buffer.from(auth_key_str).toString('base64'))
    // console.log(buffer.from(auth_key, 'base64').toString('ascii'))
    // console.log(client_ip);

    var sql = `INSERT INTO md_user (project_name, db_type_id, db_host, db_user, db_password, db_name, auth_key, created_by, created_at)
    VALUES ("${data.project_name}", "${data.db_type}", "${data.db_host}", "${data.db_user}", "${db_pass}", "${data.db_name}", "${auth_key}", "${client_ip}", "${datetime}")`;
    db.query(sql, (err, lastId) => {
        if (err) {
            res.end(err);
        } else {
            res.send(`Welcome to our service.\n
            Please note the auth key for api access\n
            AUTH KEY: ${auth_key}`);
        }
    })
}

const decodeString = (req, res) => {
    var str = 'NSMjeyJwcm9qZWN0X25hbWUiOiJlQmFuaWp5byIsImRiX3R5cGUiOiIxIiwiZGJfaG9zdCI6IjE5OC43MS42MS4xOTM6MzMwNiIsImRiX3VzZXIiOiJlYmFuaWp5YV91c2VyIiwiZGJfcGFzcyI6IlN5bmVyZ2ljV2ViQDIwMjAiLCJkYl9uYW1lIjoiZWJhbmlqeWEifSMjMjAyMi0wNi0xNQ=='
    var buffer_obj = Buffer.from(str, "base64");
    var real_str = buffer_obj.toString("utf8")
    console.log(real_str);
    res.send(real_str)
}

module.exports = { UserReg, saveUserDtls, decodeString };