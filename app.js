var express = require('express');
var app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "aa-ava.cfdpy4hwkimw.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "SanFran6!"
});

con.connect(function(err) {
    if (err) throw err;
});

var apiService = require ('./apiService');

app.listen(11001, () => {
 console.log("Server running on port 11001");
});

app.post('/api/createOrder', apiService.createOrder);
app.get('/api/getOrder', apiService.getOrder);
app.get('/api/getPaymentStatus', apiService.getPaymentStatus);
app.post('/api/orderPayment', apiService.orderPayment);