// CONSTANTS
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT  = 8000;
// GENERAL CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// MONGOOSE CONFIG
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;
// MONGOOSE SCHEMAS + COLLECTIONS
var QuoteSchema = new mongoose.Schema({
  name: {type: String},
  quote: {type: String}
}, {timestamps: true})
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');
// VARIABLES
var errors = [];
// ROUTES
app.get('/', (req, res)=>{
  res.render('index', {errors: errors});
});
app.post('/quotes', (req, res)=>{
  errors = [];
  if (req.body.button == "add"){
    console.log('POST DATA', req.body);
    let quoteInstance = new Quote();
    quoteInstance.name = req.body.name;
    quoteInstance.quote = req.body.quote;
    quoteInstance
      .save()
      .then(()=>{
        console.log('quote saved successfully');
        res.redirect('/quotes');
      })
      .catch((err)=>{
        console.log(err);
        errors.push(err);
        res.redirect('/');
      })
  }else if (req.body.button == "skip"){
    console.log('POST DATA', req.body);
    res.redirect('/quotes');
  }
});
app.get('/quotes', (req, res)=>{
  errors = [];
  let allQuotes = Quote.find().sort('-createdAt');
  allQuotes
    .exec()
    .then((allQuotes)=>{
      res.render('quotes', {quotes: allQuotes})
    })
    .catch((err)=>{
      errors.push(err);
      res.render('/quotes', {quotes: ''});
    })
});
// THE IMPORTANT SERVER BIT
app.listen(PORT, () => {
  console.log('listening on port' + PORT);
});
