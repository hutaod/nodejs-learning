const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/test", { 
  useNewUrlParser: true, useUnifiedTopology: true
})

var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log("connected")
})

var kittySchema = mongoose.Schema({
  name: String
})

kittySchema.methods.speek = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model("Kitten", kittySchema)
// var felyne = new Kitten({ name: 'Felyne' })

// var fluffy = new Kitten({ name: 'fluffy' })
// felyne.save(function (err, felyne) {
//   if (err) return console.error(err);
//   console.log(felyne.name)
// });

Kitten.find({ name: 'fluffy' }, function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})