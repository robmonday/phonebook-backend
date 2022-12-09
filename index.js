require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')


const cors = require('cors')
const { connection } = require('mongoose')
app.use(cors())

// Removed as instructed, so app can work with fly.io
// const morgan = require('morgan')
// morgan.token('postObj',(req) => {return JSON.stringify(req.body)})
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postObj'))

let data = {
	"persons": [
		{
			"name": "Susan Cowan",
			"number": "865-384-1490",
			"id": 1
		},
		{
			"name": "Rob Monday",
			"number": "678-561-7626",
			"id": 2
		},
		{
			"name": "Richard Cowan",
			"number": "865-740-0011",
			"id": 3
		}
	]
}

app.use(express.static('build'))

// This path has been overridden by the above static method
app.get('/', (req, res) => {
	res.send('<h1 style="color: blue;">Hello World!</h1>')
})

app.use(express.json())

app.get('/api/persons', (req, res) => {
	Person.find({})
	// data returned needed to be placed as value of "persons" key inside an object
	// because this is how I originally built my frontend
	.then( persons => {
		const data = {}
		data.persons = persons
		// console.log(data)
		res.json(data)
	})
}) 

app.get('/info', (req, res) => {
	Person.find({}).then( persons => 
		res.send(`<p>Phonebook has info for ${persons.length} people</p> 
		<p>${new Date()}</p>`))
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = data.persons.find(p => id===p.id)
	if (person) {
		res.json(person)
	} else {
		console.log("Person record not found")
		res.statusMessage = `No person with id = ${id}`
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	data.persons = data.persons.filter(p => p.id !== id)

	res.status(204).end()
})

const generateId = () => {
	return Math.floor(Math.random() * 10**8)
}

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

// Old Version
// app.post('/api/persons', (req, res) => {
// 	// console.log("POST request body", req.body)
// 	const body = req.body // get body from POST request

// 	// validation
// 	const nameFound = data.persons.find(p => p.name === body.name)
// 	console.log("nameFound", nameFound)
// 	if (nameFound) {
// 		return res.status(400).json({error: 'Name already has a record'})
// 	} else if(!body.name) {
// 		return res.status(400).json({error: 'No name submitted'})
// 	} else if (!body.number) {
// 		return res.status(400).json({error: 'No number submitted'})
// 	} // returned value is not used anywhere, but returning, prevents rest of code from running

// 	const newPerson = {
// 		name: body.name, 
// 		number: body.number,
// 		id: generateId()
// 	}
// 	data.persons = data.persons.concat(newPerson)
// 	res.json(newPerson)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

