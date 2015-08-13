/*
---------------------------------------------------------
********************  JUST  NOW  ********************
---------------------------------------------------------
*/
Parse.Cloud.define("hello2", function(request, response) {
	
	if (request.params.TYPE=="ok") {response.success("OK");}
	else{
		response.error();
	}
});

Parse.Cloud.define("newNotificationTEST", function(request, response) {
	
	alert("NEWNOTI CALLED");
	var User = request.user;
	var Type = request.params.TYPE;
	var UserDestination = request.params.USERDESTINATIONID


	var NotiTypes = Parse.Object.extend("notificationType");
	var query = new Parse.Query(NotiTypes);

	query.equalTo("type",Type);
	query.first({
	  success: function(results) {
	    	Type = results;

	    	alert(Type);

	    	if (Type.get("enable")) {
	    		var Notification = Parse.Object.extend("notification");
				var notification = new Notification();

				query = new Parse.Query(Parse.User);
				query.equalTo("objectId",request.params.USERDESTINATIONID);
				query.first({

					success: function(userDest){
						notification.save({
						  user: request.user,
						  nType: Type,
						  userDestination: userDest,
						  Data: request.params.DATA
						  
						},
						{
						  success: function(notification) {
							
							response.success("Notification Created");
						  	
						  	if (Type.get("sendPush")) {

						  		var query = new Parse.Query(Parse.Installation);
								query.equalTo('user', userDest);

								Parse.Push.send({
								  where: query, // Set our Installation query
								  data: {
								    alert: "The Mets scored! The game is now tied 1-1.",
								    title: "JustNow",
								    name: "Vaughn"
								  }
								});
						  	}
						    
						  },
						  error: function(notification, error) {
						    // The save failed.
						    // error is a Parse.Error with an error code and message.
						    response.error("Notification NOT Created");
							}
						});
					}},
					{error: function(user, error){
						response.error("ERROR 2");
					}});	
	    	}	    	
	    }},
	    {error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		    response.error("ERROR 3");
		  	}
		}
	);
});



Parse.Cloud.define("hello", function(request, response) {
	var Text = request.params.TEXT;
	

  response.success(Text);
});

/*

WELCOME MAIL

Sends a welcome mail to a given user
@param MAIL the destination mail
@param USERNAME the destination username
*/

Parse.Cloud.define("sendWelcomeMail", function(request, response) {

	var destinationAdress = request.params.MAIL;
	var userName = request.params.USERNAME;

  
	var Mandrill = require('mandrill');

	//API Key from mandrillapp.com
	Mandrill.initialize('meALACOkFA0JlzCmbVnbSA');

	Mandrill.sendEmail({
  		message: {
		    text: "Hola " + userName + "\n \nEl equipo de Just Now te da la Bienvenida",
		    subject: "Bienvenido a Just Now",
		    from_email: "registrations@justnow.cat",
		    from_name: "JustNow",
		    to: [
		      {
		        email: destinationAdress,
		        //name: "Your Name"
		      }
		    ]
		},
  		async: true
	},{

	success: function(httpResponse) {
	console.log(httpResponse);
	response.success("Email sent!");
	},

	error: function(httpResponse) {
	console.error(httpResponse);
	response.error("Uh oh, something went wrong");
	}
});



Parse.Cloud.define("newNotification", function(request, response) {
	alert("NEWNOTI CALLED");
	var User = request.user;
	var Type = request.params.TYPE;
	var UserDestination = request.params.USERDESTINATIONID


	var NotiTypes = Parse.Object.extend("notificationType");
	var query = new Parse.Query(NotiTypes);

	query.get("type",TYPE );
	query.first({
	  success: function(results) {
	    	Type = results;

	    	if (Type.get("enable")) {
	    		var Notification = Parse.Object.extend("notification");
				var notification = new Notification();

				query = new Parse.Query(Parse.User);
				query.get("objectId",UserDestination);
				query.first({

					success: function(userDest){
						notification.save({
						  user: request.user,
						  nType: Type,
						  userDestination: userDest,
						  Data: request.params.DATA
						  
						},
						{
						  success: function(notification) {
							
							response.success("Notification Created");
						  	
						  	if (Type.get("sendPush")) {

						  		var query = new Parse.Query(Parse.Installation);
								query.equalTo('user', notification.get("userDestination"));


								Parse.Push.send({
								  where: query, // Set our Installation query
								  data: {
								    alert: "The Mets scored! The game is now tied 1-1.",
								    title: "JustNow",
								    name: "Vaughn"
								  }
								});
						  	}
						    response.success();
						  },
						  error: function(notification, error) {
						    // The save failed.
						    // error is a Parse.Error with an error code and message.
						    response.error();
							}
						});
					}},
					{error: function(user, error){
					}});	
	    	}	    	
	    }},
	    {error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		    response.error();
		  	}
		}
	);
});
});


