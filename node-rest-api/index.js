const express = require('express');
const app = express ();
const Joi = require('joi');

let whoami = {studentNumber: '2694083'}

app.get('/whoami', (req, res) => {
    res.json(whoami);
});

const books = [
    {
        id: "1",
        title: "To Kill a Mockingbird",
        details: [
            {
                id: "1",
                author: "James Bond",
                genre: "Fiction",
                publicationYear: 1960
            }
        ],
    },
    {
        id: "2",
        title: "Pride",
        details: [
            {
                id: "2",
                author: "Harper Lee",
                genre: "Fiction",
                publicationYear: 1970
            }
        ],
    },
    {
        id: "3",
        title: "Death",
        details: [
            {
                id: "3",
                author: "George Orwell",
                genre: "Non-Fiction",
                publicationYear: 1809
            }
        ],
    },
    {
        id: "4",
        title: "To Kill ",
        details: [
            {
                id: "4",
                author: "Bob Harvey",
                genre: "Science",
                publicationYear: 1922
            }
        ],
    }
];

//middleware that parses json etc etc
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello Hadi');
});

//api active
app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
  });

//defining another route to get all cars
app.get('/books', (req, res) => {
    // sends array of car objects 
    res.send((books));
});

//get a single car
app.get('/books/:id', (req, res) => {
 
    // find car object 
    const book = books.find(b => b.id == (req.params.id)); //returns string so use and using const since we arent resseting car
    if (!book) res.status(404).send('This Book ID can not be found');
    res.send(book);

});

const bookSchema = Joi.object({
    title : Joi.string().min(3).required(),
    details: Joi.array().items(
        Joi.object({
          author: Joi.string().min(2).required(),
          genre: Joi.string().min(2).required(),
          publicationYear: Joi.number().integer().required()
        })
      ).required()
    });


//creating a new car
app.post('/books', (req, res) => {
    //validate input
    const {id, title, details} = req.body;

    if (!title || typeof title !== 'string' || title.length < 3) {
        return res.status(400).send('Title is required and must be at least 3 characters long');
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
        return res.status(400).send('Missing required book details');
    }

    details.forEach((detail, index) => {
        if (!detail.author || typeof detail.author !== 'string' || detail.author.length < 3) {
            return res.status(400).send(`Missing required book details`);
        }

        if (!detail.genre || typeof detail.genre !== 'string' || detail.genre.length < 2) {
            return res.status(400).send(`Missing required book details`);
        }

        if (!detail.publicationYear || typeof detail.publicationYear !== 'number' || detail.publicationYear < 1500) {
            return res.status(400).send(`Missing required book details`);
        }
    });

    //const { error } = bookSchema.validate(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    //new object and no DB so manually assign id 
    
    const newBook = {id:  books.length + 1, title, details}
    books.push(newBook);

    res.status(201).send(newBook);
        
    
    //push to array
    books.push(book);
    //return object in body of response, need to send to client 
    res.send(book);
});


//put request - updating a book
app.put('/books/:id', (req, res) => {
    //find book
    const book = books.find(b => b.id == (req.params.id));
    if (!book) return res.status(404).send('This Book ID cannot be found');

    //validate input
    //const { error } = bookSchema.validate(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    //assign new details to car
    Object.assign(book, req.body);
    res.send(book);

});
//delete request - deleting a book
app.delete('/books/:id', (req, res) => {
    const book = books.find(b => b.id ==(req.params.id));
    if (!book) return res.status(404).send('This Book ID cannot be found');

    //deleting
    const index  = books.indexOf(book);
    books.splice(index, 1);

    //response
    res.send(book);

});


//post request - add a detail
app.post('/books/:id/details', (req,res) => {
    const book = books.find(b => b.id ==(req.params.id));
    if (!book) return res.status(404).send('This Book ID cannot be found');

    
    const existDetails = book.details[0];
    Object.assign(existDetails, req.body)


    res.status(201).send(book);

});


//delete request - delete the details of a book

app.delete('/books/:id/details/:detailId', (req,res) => {
    //find by bookid
    const book = books.find(b => b.id == (req.params.id));
    if (!book) return res.status(404).send('This Book ID cannot be found');
    //find by detail id
    const detailIndex = book.details.findIndex(d => d.id == (req.params.detailId));
    if (detailIndex === -1) return res.status(404).send('This Detail ID cannot be found')

   //remove detail
    book.details.splice(detailIndex, 1);

    res.send(book);

});


/* app.get('/status', (request, response) => {
    const status = {
       'Status': 'Running'
    };
    
    response.send(status);
});




app.delete() */

