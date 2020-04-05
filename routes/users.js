var express = require('express');
var router = express.Router();
const User = require("../models/User");
const Todo = require("../models/Todo");
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

const controlAdmin = async (req, res, next) => {			// controls weather a user is admin or not
	let result = await handler.read(User, {_id: req.session.user._id}, {});			// returns information in DB about the user logged in		
	if (result[0].admin) {					// Controls weather logged in user is still admin
		console.log("user is admin");
		next();							// if true, log true and continue function
	} else {							
		req.session.user.admin = false;			// else update state session for logged in user to false
		console.log("user is not admin");			// log user is not admin
		res.redirect('/profile');					// and redirect to profile page, only admins allowed acces
	}
}
/*
	*
	*	The following routes is for users 
	* 	Following is routes for:
	* 		/see todoApp
	*		/ edit todoApp
	*		/ edit profile
	* 		/ 
	*
*/

router.get('/createTodo', redirectIndex, function(req, res, next) {	// reads front page - If user is logged in, redirct to profile page
	console.log(req.session);	// logs the session for user, should be empty at all times when on index
	res.render('createTodo', {		// render index page
		scriptLink:'/javascripts/todo.js',
		title: headTitle,
		subtitle: 'Create a new todo for your application' 
	});
});

	
router.post('/createTodo', redirectIndex, async function(req, res, next) {
    let user = handler.upsertTodo(req);
    res.render('createTodo', {  // direct them back to index, untill they are approved
    	scriptLink:'/javascripts/todo.js',
		title: headTitle,
		subtitle: 'A new todo has been succesfully created, find todo in "see your list"'
	});
});

router.post('/deleteTodo', redirectIndex, async function(req, res, next) { // deletes user from db
	let result = await handler.read(Todo, {_id: req.body.userid}, {});
	result[0].concede = true;
	let update = await handler.updateTodoState({result});
    let todo = await handler.read(Todo, {}, {sort: {priority: -1}});		// read all users from DB
    res.render('profile', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "Task has been removed",
        user: req.session.user,
		scriptLink: "/javascripts/profile.js",
		todo: todo
    });
});

router.post('/complete', redirectIndex, async function(req, res, next) { // deletes user from db
	let result = await handler.read(Todo, {_id: req.body.userid}, {});
	result[0].complete = true;
	let update = await handler.updateTodoState({result});
    let todo = await handler.read(Todo, {}, {sort: {priority: -1}});		// read all users from DB
    res.render('profile', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "Task has been completed",
        user: req.session.user,
		scriptLink: "/javascripts/profile.js",
		todo: todo
    });
});

router.get('/todoApp', redirectIndex, async function(req, res, next) {
    let todo = await handler.read(Todo, {user: req.session.user._id}, {}); // returns all users
    res.json(todo);				// send variable as JSON object on request
});


/*
	*
	*	The following routes is for admin users only
	* 	Following is routes for:
	* 		/admin Panel
	*		/ Delete user
	*		/ Approve user
	* 		/ make users admin
	*
*/

/* GET users listing. */
router.get('/adminPanel', redirectIndex, controlAdmin, async function(req, res, next) {	// see list of user and edit them
	let user = await handler.read(User, {}, {sort: {approved: 1}}); // returns all users
	res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        who: req.session.user,
        users: user
    });
});

router.post('/delete', redirectIndex, controlAdmin, async function(req, res, next) { // deletes user from db
    let delUser = await handler.delete(User, {_id: req.body.userid});		// deletes requested user
    let user = await handler.read(User, {}, {sort: {approved: 1}});		// read all users from DB
    res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        who: req.session.user,
        users: user
    });
});

router.post('/approve', redirectIndex, controlAdmin, async function(req, res, next) {		// approves unverified user
	let result = await handler.read(User, {_id: req.body.userid}, {});	// return requested user
	if (result[0].approved) {			// Switch value of verification
		result[0].approved = false;
	} else {
		result[0].approved = true;
	}
	let update = await handler.updateUserState({result});			// update new information
	let user = await handler.read(User, {}, {sort: {approved: 1}});			// return all users
    res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        msg: "User verification is now: " + result[0].approved,
        who: req.session.user,
        users: user
    });
});

router.post('/makeAdmin', redirectIndex, controlAdmin, async function(req, res, next) {		// changes admin state for users
	let result = await handler.read(User, {_id: req.body.userid}, {});		// returns requested user
	if (result[0].admin) {			// swtich value of admin
		result[0].admin = false;
	} else {
		result[0].admin = true;
	}
	let update = await handler.updateUserState({result});		// update with new information
	let user = await handler.read(User, {}, {sort: {approved: 1}});		// returns all users
    res.render('adminPanel', {		// render adminPanel with all users and logged in user send as objects
		title: headTitle,
		scriptLink: "/javascripts/profile.js",
        subtitle: "You are accessing admin panel as: " + req.session.user.firstName + " " + req.session.user.lastName,
        msg: "User Admin rights has now been changed to: " + result[0].admin,
        who: req.session.user,
        users: user
    });
});

module.exports = router;
