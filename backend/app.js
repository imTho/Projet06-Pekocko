const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
require('dotenv').config();

const app = express();

//Helmet protection des headers
app.use(helmet());

//Connexion à la base de donnée
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.MDP}@${process.env.HOST}/<dbname>?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Securité CORS
app.use((req, res, next) => {
    //Ajout des header à la réponse
    res.setHeader('Access-Control-Allow-Origin', '*'); //API accessible depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Indiquer les methodes authorisées
    next();
});


app.use(bodyParser.json()); //Rend les données du corps de la requête exploitable

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;