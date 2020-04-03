"use strict";
const mon = require("./mongooseWrap");
const bcrypt = require('bcryptjs');                         // added for hashing
const User = require("./User");
const saltTurns = 10;
const dbServer = "localhost";
const dbName = "todoApp";

exports.upsertUser = async function (req) {
    let check = { email: req.body.email };
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltTurns)
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
        return
    } catch(e) {
        console.error(e);
    }
};

exports.getUsers = async function(query, sort) {
    try {
        let cs = await mon.retrieve(dbServer, dbName, User, query, {});     // return requested user
        return cs;
    } catch (e) {
        console.error(e);
    }
};


exports.verifyUser = async function (req) {
    let check = { email: req.body.email }; 
    let u = await this.getUsers(check, {});     // returns user for requested email
    if (u.length === 0) {               // if no user found, return false - no need to try and match password none existing users
        req.session.wrong = "email or password is incorrect";
        return false
    } 
    let success = await bcrypt.compare(req.body.password, u[0].password);   // matching passwords
    if (success) {                            // defining usefull information for session object
        if (!u[0].approved) {
            req.session.wrong = "Your account has not yet been approved by admin";
            return false
        } else {
            req.session.authenticated = true;
            req.session.wrong = false;
            req.session.user = u[0];                   // inserting user details as object 
        }  
    } else {
        req.session.wrong = "email or password is incorrect";
    }
    return success;     // return succes for match
};