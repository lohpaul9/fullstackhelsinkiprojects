const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackpractice:${password}@cluster0.iji3j.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name : String,
    number : String,
})

const Person = mongoose.model('Person', contactSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name : process.argv[3],
        number : process.argv[4]
    })

    person.save().then(result => {
        console.log(person, '\n note saved!')
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    Person.find({}).then(response => {
        console.log('Phonebook: ')
        response.forEach(item => console.log(item.name, ' ', item.number))
        mongoose.connection.close()
    })
}
else {
    console.log('please provide proper number of arguments!')
    mongoose.connection.close()
}
