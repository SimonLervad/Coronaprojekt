var express = require('express');
var router = express.Router();
const handler = require("../models/handler");
const headTitle = "Todo list application";	//save keystrokes

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

/* GET home page. */
router.get('/', redirectProfile, function(req, res, next) {	// reads front page - If user is logged in, redirct to profile page
	console.log(req.session);	// logs the session for user, should be empty at all times when on index
	res.render('index', {		// render index page
		scriptLink:'/javascripts/login.js',
		title: headTitle,
		subtitle: 'Login or registrate' 
	});
});

router.get('/profile', redirectIndex, function(req, res, next) {	// reads profile pages, and checks if user is logged in
	console.log(req.session);	// Log session for user
	res.render('profile', { 	// render profile page with user information
		title: headTitle,
		subtitle: 'Welcome to todo App - start creating your list today',
		loggedin: true,
		who: "Hello " + req.session.user.firstName + " " + req.session.user.lastName,
		user: req.session.user,
		scriptLink: "/javascripts/profile.js"
	});
});

// add new user - waiting for confirmation from admin user
router.post('/registrate', redirectProfile, async function(req, res, next) {
    let user = handler.upsertUser(req); // creates new user with requested data
    userMsg = ` 
    	You account has succesfully been created. You have not yet been approved.. \
    	You can still login to your account, but will be denied acces before approved by admin.
    `	// tells the use weather is succeded or not
    console.log(req.session);	// logs new user
    res.render('index', {  // direct them back to index, untill they are approved
		title: headTitle,
		subtitle: 'Hello ' + req.body.firstName + " " + req.body.lastName + userMsg
	});
});

router.post('/login', redirectProfile, async function(req, res) {// new user post route
	let rc = await handler.verifyUser(req); // verify credentials
	console.log(req.session);
	if (rc) { // if user exists and is approved by admin
		res.render('profile', { 
			title: headTitle,
			subtitle: 'Welcome to todo App - start creating your list today',
			loggedin: true,
			who: "Hello " + req.session.user.firstName + " " + req.session.user.lastName,
			user: req.session.user,
			scriptLink: "/javascripts/profile.js"
		});
	} else { // user not there
		res.render('index', { // return to front page
			scriptLink:'/javascripts/login.js',
			title: headTitle,
			subtitle: 'Login or registrate',
			loggedin: false,
			wrong: req.session.wrong
		});
	}
});

// returns req.session as object via AJAX for admin user - gives who are admins acces to the admin panel
router.get('/admin', redirectIndex, async function(req, res, next) {
    let session = req.session		// define session as variable
    res.json(session);				// send variable as JSON object on request
});


// logout a user
router.get('/logout', redirectIndex, async function(req, res) { // request for logging out
	delete req.session.wrong;	// remove message from object
	req.session.authenticated = false; 		// set authenticated to false
	delete req.session.user;		// delete the user information on req.session
	res.render('index', { // return to front page
		scriptLink:'/javascripts/login.js',
		title: headTitle,
		subtitle: 'You have been logged out - See you later',		// making sure they get the message
		loggedin: false
	});
	console.log(req.session);		// display session object to show logout has been succesfull
});



/*

	*
	* This was the end of all session routing
	* All above routes, gives user acced to login/logout, register, profile page and front page. 
	* All remaining routes is for users, and will be fount in users.js
	*

*/



module.exports = router;
