const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const {con} = require('./db');
const Router = require("./routes");
const contractorRouter = require("./contractorRoutes");
const dealerRouter = require("./dealerRoutes");
var useragent = require('express-useragent');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000
const {saveMessages, getReceiverSocketId}  = require('./helpers/general');
const { log } = require("console");


const app = express()
//socket events
const server  = require('http').createServer(app);

const io = require('socket.io')(server)

app.use(express.json({limit: '200mb'}));
app.use(fileUpload())
app.use(cors({
	origin:"*"
}))
app.use(express.static(path.resolve("./public")));

const socketIds = []

//socket connection and events
io.on('connection', function(socket) {

	socket.on('newUser', function(user_id)
	{
		const ids = {
			user_id: user_id.user_id,
			socked_id: socket.id
		}
	
		const existingSocketIndex = socketIds.findIndex((s) => s.user_id === user_id.user_id);
	
		if (existingSocketIndex > -1) {
		  // User already exists in array
		  socketIds[existingSocketIndex].socket_id = socket.id;
		} 
		else
		{
			  // User does not exist in array
			  socketIds.push(ids);
		}
    });


    socket.on('chat', async function(data)
	{	
		//save message to database
		const saveMessage = await saveMessages(data);
		//find receiver socket id
		let receiverSocketId;

		const existingSocketIndex = socketIds.findIndex((s) => s.user_id === data.receiverId);

		if (existingSocketIndex > -1) {
			receiverSocketId = socketIds[existingSocketIndex].socket_id;
			
		} 
		// to individual socket id (private message)
        io.to(receiverSocketId).emit('chat', data.message)
	
    });
});

app.use(useragent.express())


con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});




app.get("/",function(request,response){
	response.send("welcome")
});

app.use("/api", Router);
app.use("/api", contractorRouter);
app.use("/api", dealerRouter);

server.listen(port, function () {
	console.log("Started application on port %d", port)
});



// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require("dotenv").config();
// const {con} = require('./db');
// const Router = require("./routes");
// const contractorRouter = require("./contractorRoutes");
// const dealerRouter = require("./dealerRoutes");
// var useragent = require('express-useragent');
// const fileUpload = require('express-fileupload');
// const port = process.env.PORT || 5000
// const {saveMessages, getReceiverSocketId}  = require('./helpers/general');
// const { log } = require("console");
// const fs = require("fs")

// const app = express()
// //socket events
// //const server  = require('https').createServer(app);

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/soodprints.in/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/soodprints.in/fullchain.pem')
// };


// const server  = require('https').createServer(options, app);

// const io = require('socket.io')(server)

// app.use(express.json({limit: '200mb'}));
// app.use(fileUpload())
// app.use(cors({
//         origin:"*"
// }))
// app.use(express.static(path.resolve("./public")));

// const socketIds = []

// //socket connection and events
// io.on('connection', function(socket) {

//         socket.on('newUser', function(user_id)
//         {
//                 const ids = {
//                         user_id: user_id.user_id,
//                         socked_id: socket.id
//                 }

//                 const existingSocketIndex = socketIds.findIndex((s) => s.user_id === user_id.user_id);

//                 if (existingSocketIndex > -1) {
//                   // User already exists in array
//                   socketIds[existingSocketIndex].socket_id = socket.id;
//                 }
//                 else
//                 {
//                           // User does not exist in array
//                           socketIds.push(ids);
//                 }
//     });


//     socket.on('chat', async function(data)
//         {
//                 //save message to database
//                 const saveMessage = await saveMessages(data);
//                 //find receiver socket id
//                 let receiverSocketId;

//                 const existingSocketIndex = socketIds.findIndex((s) => s.user_id === data.receiverId);

//                 if (existingSocketIndex > -1) {
//                         receiverSocketId = socketIds[existingSocketIndex].socket_id;

//                 }
//                 // to individual socket id (private message)
//         io.to(receiverSocketId).emit('chat', data.message)

//     });
// });

// app.use(useragent.express())


// con.connect(function (err) {
//         if (err) throw err;
//         console.log("Connected!");
// });




// app.get("/",function(request,response){
//         response.send("welcome")
// });

// app.use("/api", Router);
// app.use("/api", contractorRouter);
// app.use("/api", dealerRouter);

// server.listen(port, function () {
//         console.log("Started application on port %d", port)
// });
