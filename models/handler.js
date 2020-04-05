"use strict";
const mon = require("./mongooseWrap");
const bcrypt = require('bcryptjs');                         // added for hashing
const User = require("./User");
const Todo = require("./Todo");
const saltTurns = 10;
const dbServer = "localhost";
const dbName = "todoApp";

exports.upsertUser = async function (req) {     //create
    let check = {email: req.body.email};
    console.log(req.body);
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

exports.updateUserState = async function (req) {     // creates a new user
    let check = { _id: req.result[0]._id };
    let user = new User({
        admin: req.result[0].admin,
        approved: req.result[0].approved,
        firstName: req.result[0].firstName,
        lastName: req.result[0].lastName,
        email: req.result[0].email,
        password: req.result[0].password
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
        return
    } catch(e) {
        console.error(e);
    }
};

exports.upsertTodo = async function (req) {     // creates a new todo
    let check = {title: req.body.title, content: req.body.content, user: req.session.user._id};
    console.log(req.body);
    let todo = new Todo({
        user: req.session.user._id,
        title: req.body.title,
        content: req.body.content,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
        priority: req.body.priority,
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, Todo, todo, check);
        return
    } catch(e) {
        console.error(e);
    }
};

exports.updateTodoState = async function (req) {     // creates a new user
    let check = { _id: req.result[0]._id };
    let todo = new Todo({
        user: req.result[0].user,
        title: req.result[0].title,
        content: req.result[0].content,
        startDate: req.result[0].startDate,
        deadline: req.result[0].deadline,
        priority: req.result[0].priority,
        complete: req.result[0].complete,
        concede: req.result[0].concede,
        completeDate: Date.now
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, Todo, todo, check);
        return
    } catch(e) {
        console.error(e);
    }
};

exports.read = async function(collection, query, sort) {        // reads requested data from DB
    try {
        let cs = await mon.retrieve(dbServer, dbName, collection, query, sort);     // return requested user
        return cs;
    } catch (e) {
        console.error(e);
    }
};

exports.delete = async function (collection, name) {        // delete requested user, with requested collections
    try {
        let cs = await mon.remove(dbServer, dbName, collection, name);      // deletes requested content
        return cs;
    } catch (e) {
        console.log(e);
    }
}

exports.verifyUser = async function (req) {
    let check = { email: req.body.email }; 
    let u = await this.read(User, check, {});     // returns user for requested email
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