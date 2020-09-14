const Sauce = require('../models/sauce');
const fs = require('fs');

//Créer et ajout un nouvel 'sauce' dans la BDD
exports.createSauce = (req, res, next) => {
    //Création de sauce
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        //on recupere l'image avec une URL dynamique
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    //Sauvegarde dans la BDD
    sauce.save()
        //Envoi une reponse pour eviter expiration de la requete
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//Recupérer UN objet de la BDD
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//Modifier UN objet de la BDD
exports.modifySauce = (req, res, next) => {
    //On verifie si la req contient un fichier
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Si la requete contient un fichier on traite la nouvelle image
    } : {
        ...req.body // Si la req n'a pas de fichier on envoi seulement le contenu modifier
    };
    //On effectu la modification
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//Supprimer UN objet de la BDD
exports.deleteSauce = (req, res, next) => {
    //On cherche l'objet correspondant à l'id dans la BDD
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            //On extrait le nom du fichier depuis l'url
            const filename = sauce.imageUrl.split('/images/')[1];
            //On supprime le fichier du server
            fs.unlink(`images/${filename}`, () => {
                //Puis on supprime l'objet de la BDD
                sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

//Recupérer TOUS les objets de la BDD
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {

};