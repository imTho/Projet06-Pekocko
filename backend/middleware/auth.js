const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        //On prend le token de la requete
        const token = req.headers.authorization.split(' ')[1];
        //On le decode grace au TOKEN SECRET
        const decodedToken = jwt.verify(token, 'cL7DC79nh3e7QvG');
        //On extrait l'user id du TOKEN
        const userId = decodedToken.userId;
        //On le compare avec celui de la requete
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next(); //Si il est juste on passe au middleware suivant
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};