const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

  
  app.get('/api/persons', (req, res) => {
    console.log('fluffy couscous')
    res.json(persons)
  })

  app.get('/info', (req, res) => {
      console.log('sushi time!')
      res.send(`<p>Phonebook has info of ${persons.length} people</p>
      <p>${new Date()}</p>`)
  })

  app.get('/api/persons/:id', (req, res) => {
      const id = Number(req.params.id)
      const person = persons.find(note => note.id === id)

      if (person) {
        res.json(person)
      } else {
          res.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (req, res) => {
      const id = Number(req.params.id)
      persons = persons.filter(person => person.id !== id)

      res.status(204).end()
  })

  const generateId = () => {
      const newId = Math.floor(Math.random()*5000000) + 1
      console.log(newId)
      return newId
  }

  app.post('/api/persons', (req, res) => {
      const body = (req.body)
      
      if(!body.name || !body.number) {
          return res.status(400).json({
              error: 'name and/or number missing'
          })
      }

      if(persons.some(person => person.name === body.name)) {
          return res.status(400).json({
              error: 'person with same name already saved'
          })
      }

      const person = {
          name: body.name,
          number: body.number,
          id: generateId()
      }

      persons = persons.concat(person)

      res.json(person)
  })
    
  const PORT = 3002
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })

