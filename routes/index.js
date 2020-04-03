var express = require('express');
var router = express.Router();
const handler = require("../models/handler");
const headTitle = "Todo list application";	//save keystrokes

const redirectProfile = (req, res, next) => {
	try { 
    	req.session.user.approved.prop;
	    res.redirect('/profile');
	} 
	catch {
	  	next();
	} 
}

const redirectIndex = (req, res, next) => {
	try { 
    	req.session.user.approved.prop;
	    next();
	} 
	catch {
	  	res.redirect('/');
	} 
}

/* GET home page. */
router.get('/', redirectProfile, function(req, res, next) {
	console.log(req.session);
	res.render('index', {
		scriptLink:'/javascripts/login.js',
		title: headTitle,
		subtitle: 'Login or registrate' 
	});
});

router.get('/profile', redirectIndex, function(req, res, next) {
	console.log(req.session);
	res.render('profile', { 
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
    let user = handler.upsertUser(req);
    userMsg = `
    	You account has succesfully been created. You have not yet been approved.. \
    	You can still login to your account, but will be denied acces before approved by admin.
    `
    console.log(req.session);
    console.log(req.body.firstName);
    res.render('index', { 
		title: headTitle,
		subtitle: 'Hello ' + req.body.firstName + " " + req.body.lastName + userMsg
	});
});

router.post('/login', async function(req, res) {// new user post route
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
router.get('/admin', async function(req, res, next) {
    let session = req.session		// define session as variable
    res.json(session);				// send variable as JSON object on request
});


// logout a user
router.get('/logout', async function(req, res) { // request for logging out
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

module.exports = router;
