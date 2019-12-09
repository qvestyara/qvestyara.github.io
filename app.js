const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "ejs");

const reviewers = [
    'Evita Kusinia',
    'Bogdan Kupranets',
    'Lurii Besidka',
    'Oksana Piaskovska',
    'Olena Shatna',
    'Yurii Petrichenko',
    'Natalia Virt',
    'Roman Pidkostelnyi',
    'Oleksiy Domianych',
    'Yurii Faevskyi',
    'Yana Schebyvok'
];
let index = 0

app.get('/', (request, response) => {
    response.render("index", {
        name: reviewers[index]
    });
})
app.get('/newReviewer', (request, response) => {
    reviewers.length - 1 === index ? index = 0 : index++;
    response.redirect('/')
})
app.listen(process.env.PORT || port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})