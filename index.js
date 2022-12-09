require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')


const cors = require('cors')
const { connection } = require('mongoose')
const { response } = require('express')
app.use(cors())

// Removed as instructed, so app can work with fly.io
// const morgan = require('morgan')
// morgan.token('postObj',(req) => {return JSON.stringify(req.body)})
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postObj'))

// Original list of objects no longer in use
// let data = {
// 	"persons": [
// 		{
// 			"name": "Local Person 1",
// 			"number": "123",
// 			"id": 1
// 		},
// 		{
// 			"name": "Local Person 2",
// 			"number": "456",
// 			"id": 2
// 		},
// 		{
// 			"name": "Local Person 3",
// 			"number": "789",
// 			"id": 3
// 		}
// 	]
// }

app.use(express.static('build'))
app.use(express.json())

// This path has been overridden by the above static method
app.get('/', (req, res) => {
	res.send('<h1 style="color: blue;">Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
	Person.find({})
	// data returned needed to be placed as value of "persons" key inside an object
	// because this is how I originally built my frontend
	.then( persons => {
		const dataObj = {}
		dataObj.persons = persons
		// console.log(dataObj)
		res.json(dataObj)
	})
}) 

app.get('/info', (req, res) => {
	Person.find({}).then( persons => 
		res.send(`<p>Phonebook has info for ${persons.length} people</p> 
		<p>${new Date()}</p>`))
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = Number(req.params.id)
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result =>
			res.status(204).end())
		.catch(error => next(error))
})

// const generateId = () => {
// 	return Math.floor(Math.random() * 10**8)
// }

app.post('/api/persons', (req, res) => {
	// console.log("POST request body", req.body)
	const body = req.body // get body from POST request

	// validation
	// const nameFound = data.persons.find(p => p.name === body.name)
	// console.log("nameFound", nameFound)
	// if (nameFound) {
	// 	return res.status(400).json({error: 'Name already has a record'})
	// } else 
	if(!body.name) {
		return res.status(400).json({error: 'No name submitted'})
	} else if (!body.number) {
		return res.status(400).json({error: 'No number submitted'})
	} // returned value is not used anywhere, but returning, prevents rest of code from running
	
	const newPerson = new Person({
		name: body.name, 
		number: body.number,
		// id: generateId()
	})
	
	newPerson.save().then(savedPerson => {
		res.json(savedPerson)
	})
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

