require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

const app = express()

morgan.token('body', req => {
    return JSON.stringify(req.body)
}
)

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: "unknown endpoint"
    })
}

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    const entries = persons.length
    const timeNow = new Date()

    const message = `<p>Phonebook has info for ${entries} people</p> \
                     <p>${timeNow}</p>`

    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// const generateId = () => {
//     const newId = Math.floor(Math.random() * 100000)
//     console.log(newId)
//     return newId
// }

app.post('/api/persons', (request, response) => {

    const body = request.body

    if ((!body.name) && (!body.number)) {
        return response.status(400).json({
            error: 'name and number missing'
        })
    }
    else if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    // else if (persons.map(person => person.name).includes(body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
