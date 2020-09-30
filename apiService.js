const mysql = require('mysql');
var uniqid = require('uniqid');
var moment = require('moment');

const con = mysql.createConnection({
    host: "aa-ava.cfdpy4hwkimw.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "SanFran6!"
});

exports.createOrder = [
    function(req, res){
        if (req.query.hotel_id && req.query.hotel_name && req.query.check_in_date && req.query.check_out_date && req.query.customer_name && req.query.customer_email && req.query.customer_phone_number && req.query.room_id && req.query.room_name && req.query.guest_num && req.query.total_amount) {
            var payment_id = uniqid();
            var booking_date = moment().format("YYYY-MM-DD"); 
            var payment_status = "NEW";
            var order_status = "NEW";
            var payment_date = null;
            var payload = "";
            con.connect(function(err) {
                con.query(`INSERT INTO main.orders (hotel_id, hotel_name, check_in_date, check_out_date, customer_name, customer_email, customer_phone_number, room_id, room_name, guest_num, total_amount, payment_id, order_status) VALUES ('${req.query.hotel_id}', '${req.query.hotel_name}', '${req.query.check_in_date}', '${req.query.check_out_date}', '${req.query.customer_name}', '${req.query.customer_email}', '${req.query.customer_phone_number}', '${req.query.room_id}', '${req.query.room_name}', '${req.query.guest_num}', '${req.query.total_amount}', '${payment_id}', '${order_status}')`, function(err, result, fields) {
                    if (err) console.log(err);
                    if (result) {
                        payload = {"The payment id for this order is": payment_id};
                    }
                    if (fields) console.log(fields);
                });

                con.query(`INSERT INTO main.payment (payment_id, booking_date, payment_date, payment_status) VALUES ('${payment_id}', '${booking_date}', '${payment_date}', '${payment_status}')`, function(err, result, fields) {
                    if (err) console.log(err);
                    if (result) res.send({payload: payload});
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.send('Missing a parameter');
        }
    }
]

exports.getOrder = [
    function(req, res){
        var getOrderSql = "";
        if (req.query.hotel_name) {
            getOrderSql = "SELECT * FROM main.orders WHERE hotel_name='"+ req.query.hotel_name +"';";
        } else if (req.query.customer_name && req.query.customer_email && req.query.customer_phone_number){
            getOrderSql = "SELECT * FROM main.orders WHERE customer_name='"+ req.query.customer_name +"' AND customer_email='"+ req.query.customer_email +"' and customer_phone_number='"+ req.query.customer_phone_number +"';";
        } else {
            res.send('Incorrect parameter(s)');
        }
        getSqlCall(req, res, getOrderSql);
    }
]

exports.getPaymentStatus = [
    function(req, res){
        var getPaymentSql = "";
        if (req.query.payment_id) {
            getPaymentSql = "SELECT * FROM main.payment WHERE payment_id="+ req.query.payment_id+";";
        } else {
            res.send('Incorrect parameter(s)');
        }
        getSqlCall(req, res, getPaymentSql);
    }
]

function getSqlCall (req, res, sqlString) {
    console.log(sqlString)
    con.connect(function(err) {
        con.query(sqlString, function(err, result, fields) {
            if (err) console.log(err);
            if (result) res.send({payload: result});
        });
    });
}

exports.orderPayment = [
    function(req, res){
        if (req.query.payment_id && req.query.credit_card_number && req.query.credit_card_expiry_date && req.query.credit_card_cvv) {
            var payment_date = moment().format("YYYY-MM-DD"); 
            var new_status="PAID";
            con.connect(function(err) {
            con.query("UPDATE main.payment SET credit_card_number="+ req.query.credit_card_number +", credit_card_expiry_date="+ req.query.credit_card_expiry_date +", credit_card_cvv="+ req.query.credit_card_cvv +", payment_status='PAID', payment_date='"+ payment_date +"' WHERE payment_id="+ req.query.payment_id +";", function(err, result, fields) {
                    if (err) res.send(err);
                    if (result) res.send({payload: "Payment successful"});
                    if (fields) console.log(fields);
                });
            });
        } else {
            res.send('Missing a parameter. Please ensure that the credit card number, credit card expiry date, credit card cvv and payment id are accurate.');
        }
    }
]

