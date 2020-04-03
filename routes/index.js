var express = require('express');
var router = express.Router();
const handler = require("../models/handler");
const headTitle = "Todo list application";	//save keystrokes

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		scriptLink:'/javascripts/login.js',
		title: headTitle,
		subtitle: 'Login or registrate' 
	});
});

// add new user - waiting for confirmation from admin user
router.post('/registrate', async function(req, res, next) {
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
	console.log(rc);
	console.log(req.session);
	if (rc) { // if user exists
		if (!req.session.user[0].approved) { // if user is approved by admin
			res.render('unApproved', { // read unApproved content
				title: headTitle,
				who: "Hello " + req.session.user[0].firstName + " " + req.session.user[0].lastName,
				subtitle: 'Your account has not yet been approved by admin',
				loggedin: true,
				user: req.session.user[0]
			});
		} else { // if user is approved by admin
			res.render('profile', { // read approved content
				title: headTitle,
				subtitle: 'Welcome to todo App - start creating your list today',
				loggedin: true,
				who: "Hello " + req.session.user[0].firstName + " " + req.session.user[0].lastName,
				user: req.session.user[0],
				scriptLink: "/javascripts/profile.js"
			});
		}
	} else { // user not there
		res.render('index', { // return to front page
			scriptLink:'/javascripts/login.js',
			title: headTitle,
			subtitle: 'Login or registrate',
			loggedin: false,
			wrong:  'email or password is incorrect' 
		});
	}
});

module.exports = router;
