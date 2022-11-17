const express = require("express");
const bodyParser = require("body-parser")
const app = express();

const MongoClient = require('mongodb').MongoClient
const uri="mongodb+srv://223:223@cluster0.dr1nlmq.mongodb.net/?retryWrites=true&w=majority"
MongoClient.connect(uri, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')
    // Middlewares and other routes here...
    // Make sure to place body-parser before the CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    // All the handlers here...
    app.get("/", function(req, res) {
        //res.sendFile(__dirname + "/index.html")
        db.collection('quotes').find().toArray()
        .then(results =>{
            console.log(results)
            res.render('crudops.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
    })
    
    app.post("/quotes", (req, res) => {
    //console.log('POST Reuqest')
    console.log(req.body)
    quotesCollection.insertOne(req.body)
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        //console.log(req.body)
        quotesCollection.findOneAndUpdate(
            { name:'Yoda'},
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
              upsert: true
            }
          )
          .then(result => {
            console.log("Success")
           })
          .catch(error => console.error(error))
      })

      app.delete('/quotes', (req, res) => {
        // Handle delete event here
        quotesCollection.deleteOne(
            {name: req.body.name}
          )
          .then(result => {
            if (result.deletedCount === 0) {
                return res.json("No quote to delete")
              }
              res.json("Deleted Darth Vader's quote")
            })
          .catch(error => console.error(error))
      })

    app.listen(3000, function() {
        console.log("listening on 3000")
    })

  })
  .catch(error => console.error(error))
//const client = new MongoClient(uri);