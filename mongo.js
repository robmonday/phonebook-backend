
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please at least provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length > 5) {
  console.log('Too many arguments.  New record can be provided as follows: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3] || ""
const number = process.argv[4] || ""

const url = `mongodb+srv://fs:${password}@cluster0.pz0p7rf.mongodb.net/phonebookApp?retryWrites=true&w=majority` // name of db established in url

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name) {
  // Add a record to the database
  mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    
    const note = new Person({ name, number })
    return note.save()
  })
  .then(() => {
    console.log(`added ${name} with ${number}`)
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err)) 
} else {
  // Return all database records
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')
  
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
}
  