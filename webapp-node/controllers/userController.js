const bcrypt = require('bcrypt');
const helper = require('../helper/helper');
const { fromString } = require('uuidv4');
const mysqlConnection= require('../db/db');
const { sign } = require("jsonwebtoken");
exports.getAllusers = (req, res) => {
    mysqlConnection.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err)
            return res.status(200).json(rows);
        else{
            return res.status(400).json({message:"Error Occurred"});
        }
    })
};

exports.checkBody = (req, res, next) => {
   if(req.body.first_name==undefined || req.body.last_name==undefined || req.body.username==undefined || req.body.password==undefined){   
        return res.status(400).json({message:"Fields Missing"});
    }
    if(helper.checkPassword(req.body.password)==false || helper.checkemail(req.body.username)==false){
        return res.status(400).json({message:"Email or password not of correct format"});
    }
    next();
};
exports.checkUserForEmail= (req, res,next) => {
    const username = req.body.username;
   const sql = "SELECT *  FROM `user` WHERE `username`='"+username+"'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (rows === undefined || rows.length == 0){
            next();
        }
        else{
            res.status(400).json({message:"User exists"});
        }
    });
}
// correct user with correct token
exports.checkUser = (req, res,next) => {
    let username = req.decoded.result;
   const sql = "SELECT *  FROM `user` WHERE `username`='"+username+"'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (rows === undefined || rows.length == 0){
            return res.status(400).json({messsage:"No user"});
        }
        else{
            console.log(username);
            console.log(rows[0].username);
            console.log(req.body.username);
            if(rows[0].username!=req.body.username){
                return res.status(400).json({messsage:"User not authorized to update"});
            }
            else{
                next();
            }
        }
    });
}
exports.createUser =(req, res,next) => {
    const data = req.body;
    const fName = data.first_name;
    const lName = data.last_name;
    const email = data.username;
    const pwd =  data.password;
    const pwdHash = bcrypt.hashSync(pwd,10);
    const id = fromString(data.username);
    const createdDate = new Date().toISOString();
    var sql = "INSERT INTO `user`(`id`,`first_name`,`last_name`,`username`,`password`, `account_created`,`account_updated`) VALUES ('" + id +"','" + fName + "','" + lName + "','" + email + "','" + pwdHash + "','" + createdDate + "','" + createdDate + "')";
    mysqlConnection.query(sql, (err, result) => {
        if (!err)
        {   const jsontoken = sign({ result: email }, "qwe1234", {
            expiresIn: "2h"
           });
            const data = {
                id:id,
                first_name:fName,
                last_name:lName,
                username:email,
                account_created: createdDate,
                account_updated: createdDate
            }
            console.log(jsontoken);
            res.status(201).json(data);
        }   
        else{
            res.status(400).json({message:"Already a user"});
        }
    });
};
exports.getUserById = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT *  FROM `user` WHERE `id`='"+id+"'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (rows.length==0){
            return res.status(404).json({message:"No user exists"});
        }
        else{
            const data = {
                id:rows[0].id,
                first_name:rows[0].first_name,
                last_name:rows[0].last_name,
                username:rows[0].username,
                account_created: rows[0].account_created,
                account_updated: rows[0].account_updated

            }
            return res.status(200).json(data);      
        }
    });
};
exports.getUser = (req, res) => {
    console.log(req.decoded.result);
    const username = req.decoded.result;;
    const sql = "SELECT *  FROM `user` WHERE `username`='"+username+"'";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (rows.length==0){
            return res.status(404).json({message:"No user found"});
        }
        else{
            const data = {
                id:rows.id,
                first_name:rows[0].first_name,
                last_name:rows[0].last_name,
                username:rows[0].username,
                account_created: rows[0].account_created,
                account_updated: rows[0].account_updated

            }
            return res.status(200).json(data);      
        }
    });
};

exports.updateUser=(req,res) => {
    let username = req.decoded.result;
    const pwdHash = bcrypt.hashSync(req.body.password,10);
    const updatedDate = new Date().toISOString();
    var sqlUpdate =  "UPDATE user set first_name =? , last_name =?,password=?,account_updated=? WHERE username = ?";
    mysqlConnection.query(sqlUpdate, [req.body.first_name, req.body.last_name,pwdHash,updatedDate,username], (err, rows, fields) => {
        if (!err){
            return res.status(204).json({message:"updated successfully"});
        }
        else{
            return res.status(400).json();
        }
    })
};