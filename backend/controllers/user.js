const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

//Inscription
exports.signup = (req, res, next) => {
    //Cryptage Email
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    //Cryptage du MDP
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: cryptedEmail,
                password: hash
            });
            //Sauvegarde de l'utilisateur dans la BDD
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};

//Connexion
exports.login = (req, res, next) => {
    const buffer = Buffer.from(req.body.email);
    const cryptedEmail = buffer.toString('base64');
    //Recherche de l'utilisateur dans la BDD
    User.findOne({
            email: cryptedEmail
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            // Si utilisateur trouvé comparaison du MDP avec la BDD
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    //Si MDP correct création d'un TOKEN à partir de l'user ID
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            'cL7DC79nh3e7QvG', {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};