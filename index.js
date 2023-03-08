const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let contacts = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    }
]

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>AAAAAAAAAAAAAAAAAAAAAAAAA!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(person => person.id == id)

    if(person){
        response.json(person)
    }else{
        response.json(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has ${contacts.length} people.</p><p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id != id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({ 
          error: 'Name is missing' 
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'Number is missing'
        })
    }

    if(contacts.some(p => p.name === body.name)){
        return response.status(400).json({
            error: 'Name already exists'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 50),
        name: body.name,
        number: body.number,
    }

    contacts = contacts.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
