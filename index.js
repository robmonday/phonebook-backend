const express = require('express')
const app = express()

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

app.get('/', (req, res) => {
	res.send('<h1 style="color: blue;">Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
	res.json(data)
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

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

