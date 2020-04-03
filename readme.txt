This files contains guides for how to setup and start using my TODO application

First you need to manually create a admin user for the application in mongoDB
Follow these instructions:

	1. open mongo in CMD or Terminal and start mongo
	2. type: "use todoApp"
	3. type: 	"db.user.insert( [ { 
					"firstName": "John", 
					"lastName": "Doe", 
					"email": "john@doe.dk", 
					"password": "$2a$10$9txWjADP1fPYZZjKYI1D6eyUF12m7K718vuPlUTsoV/cTCGWRF.MW", 
					"approved": "true", 
					"admin": "true", 
					"created" : ISODate("2020-04-02T15:01:42.645Z")  
				} ] )"
	4. type: "db.user.find().pretty()" to confirm that user John Doe has been created as adminstrator of application.

	5 - ? 	There is also created a mongoDump file in the project folder. You can choose to run "mongorestore -d todoApp --drop dump/todoApp" instead of using step 1-4 		if you prefer. The result should (allways should as developer.. ) give the same. 


Now with the database created for the application. you can now log in as
	John Doe - with following:

		John@doe.dk
		test123

	The user John Doe will have admin rights - which gives him the abillity to confirm other users and makes them admins aswell.
	If you want to add another user, you will have to login as John Doe and approve the other users, before they can login.

To give the full experience, login as John Doe first - explore the platform, afterwards you can try to create some TODO and add other users to the application. 

Good luck

Author: Simon Lervad