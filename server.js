// Load the needed dependencies
const express = require("express")
var Datastore = require("nedb") 

const app = express() // Define the server
const port = process.env.PORT || 3000 // Define the port
app.listen(port, () => {console.log("Running on port " + port)}) // Start listening at the correct port
app.use(express.static('public')) // Start running the files in the public folder 
app.use(express.json({ limit: '10mb' })) // Tell the server to read POST requests as json

// Create and load the database:
var database = new Datastore("database.db")
database.loadDatabase()

// Create the POST request reply for upload:
app.post('/api/upload', (request, response) => { 

    // First check if image already exists:
    database.find({InputValue: request.body["InputValue"]}, (err, data) => {
        if (err)
        {
            response.end()
            return
        }
        if (data.length == 0)
        {
            // Add image to database:
            response.json({
                "ErrorMessage": "None"
            })

            database.insert(request.body)
        }
        else {
            response.json({
                "ErrorMessage": "Name already exists"
            })
        }
        response.end()
    })
})

// Create the POST request reply for search:
app.post('/api/search', (request, response) => { 
    // Find the image based on the title
    database.find({InputValue: request.body["InputValue"]}, (err, data) => {
        if (err)
        {
            response.end()
            return
        }
        if (data.length != 0)
        {
            response.json({
                "image": data[0]["image"]
            })
        }
        else {
            response.json({
                "ErrorMessage": "Image not found"
            })
        }
        response.end()
    })
})
