const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    }
    , {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    }
    , {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.use(morgan('tiny', {
    skip: (req, res) => {
        return req.method === 'POST'
    }
}))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    const numberOfPersons = persons.length;
    res.send(`<p>Phonebook has info for ${numberOfPersons} people<br/><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'The name or number is missing'
        })
    }

    duplicateName = persons.find(person => person.name === body.name);

    if (duplicateName) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    logger(req, res , err => {
        if(err) return console.log('err', err)

        persons = persons.concat(person)
        res.json(person)
    })


})




const PORT = 3001
app.listen(PORT)
