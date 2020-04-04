var express = require('express');
var router = express.Router();
const User = require("../models/User");
const handler = require("../models/handler");
const headTitle = "Todo list application";  //save keystrokes

const redirectProfile = (req, res, next) => {
	try { 
    	req.session.user.approved.prop;		// tels me weather a user is approved or not
	    res.redirect('/profile');			// if user is approved, redirect them to profile page
	} 
	catch {
	  	next();								// if user is not approved, or none existing. continue function
	} 
}

const redirectIndex = (req, res, next) => {
	try { 
    	req.session.user.approved.prop;		// tels me weather a user is approved or not
	    next();								// if user is approved, continue function
	} 
	catch {
	  	res.redirect('/');					// if user is not approved, or none existing. Redirect to index page
	} 
}

/* GET users listing. */
router.get('/adminPanel', redirectIndex, async function(req, res, next) {	// see list of user and edit them
	let user = await handler.getUsers({}, {}); // creates new user with requested data
	res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        who: req.session.user,
        users: user
    });
});

router.post('/delete', redirectIndex, async function(req, res, next) { // deletes user from db
    let delUser = await handler.delete(User, {_id: req.body.userid});
    let user = await handler.getUsers({}, {});
    res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        who: req.session.user,
        users: user
    });
});

router.post('/approve', redirectIndex, async function(req, res, next) {
	let update =  await handler.updateUserState(req); // Updates user with requested data
	let user = await handler.getUsers({}, {});
    res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        who: req.session.user,
        users: user
    });
});

module.exports = router;
