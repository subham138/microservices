const mysql = require('mysql');

const connect_db = (host, port, user, password, database) => {
    return new Promise((resolve, reject) => {
        const db = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'microservice'
        });

        db.getConnection((err, connection) => {
            if (err) console.log(err);
            connection.release();
            return;
        })
        resolve(db)
    })
}


module.exports = { connect_db };