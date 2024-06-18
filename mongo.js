const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
  `mongodb+srv://ariasbruno017:${password}@phonebook-backend.2n8qhpr.mongodb.net/personsApp?retryWrites=true&w=majority&appName=phonebook-backend`

mongoose.set('strictQuery',false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d+$/.test(v)
        },
      },
    },
  })
  
  const Person = mongoose.model('Person', personSchema, 'persons')
  
  const person = new Person({
    name: newName,
    number: newNumber,
  })
  
  if (process.argv.length<4) {
    Person
      .find({})
      .then(persons => {
        persons.forEach(person => {
          console.log(person)
          mongoose.connection.close()
        })
    })
  }else{
    person
      .save()
      .then(persons => {
        console.log("added " + newName + " number " + newNumber + " to phonebook")
        mongoose.connection.close()
      })
  }
})
