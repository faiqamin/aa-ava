const mysql = require('mysql');

const con = mysql.createConnection({
    host: "aa-ava.cfdpy4hwkimw.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "SanFran6!"
});

con.connect(function(err) {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS orders(id int NOT NULL AUTO_INCREMENT, hotel_id varchar(30), hotel_name varchar(255), check_in_date DATE, check_out_date DATE, customer_name varchar(60), customer_email varchar(30), customer_phone_number varchar(30), room_id varchar(30), room_name varchar(30), guest_num varchar(30), total_amount varchar(30), payment_id varchar(30), PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
        console.log("error:", error);
    });

    con.query('CREATE TABLE IF NOT EXISTS payment(id int NOT NULL AUTO_INCREMENT, payment_id varchar(30), payment_date DATE, payment_status varchar(30), PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
        console.log("error:", error);
    });
    con.end();
});