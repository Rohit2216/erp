const mysql = require('mysql')
const util = require('util')

	const config = {
		// host: "ec2-13-201-168-204.ap-south-1.compute.amazonaws.com",
		// host:"localhost",
		host:"46.202.163.32",
		user: "root",
		password: "Rohit@2309",
		// database: "thewings_cms_update_db",
		database: "erp",
		// database:"thewings_cms_update_db"
		// database: "cms_electrical"		
	};
const con = mysql.createConnection(config);

const makeDb = () => {
	const connection = mysql.createConnection(config);
	return {
		query(sql, args) {
			return util.promisify(connection.query).call(connection, sql, args);
		},
		close() {
			return util.promisify(connection.end).call(connection);
		},
	};
};


module.exports = { con, makeDb }  

