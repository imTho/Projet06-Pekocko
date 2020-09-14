const Thing = require('../models/thing');
const fs = require('fs');

//Créer et ajout un nouvel 'Thing' dans la BDD
exports.createThing = (req, res, next) => {
    //Création de Thing
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        //URL dynamique
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    //Sauvegarde dans la BDD
    thing.save()
        //Envoi une reponse pour eviter expiration de la requete
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//Recupérer UN objet de la BDD
exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
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
exports.modifyThing = (req, res, next) => {
    //On verifie si la req contient un fichier
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Si la requete contient un fichier on traite la nouvelle image
    } : {
        ...req.body // Si la req n'a pas de fichier on envoi seulement le contenu modifier
    };
    //On effectu la modification
    Thing.updateOne({
            _id: req.params.id
        }, {
            ...thingObject,
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
exports.deleteThing = (req, res, next) => {
    //On cherche l'objet correspondant à l'id dans la BDD
    Thing.findOne({
            _id: req.params.id
        })
        .then(thing => {
            //On extrait le nom du fichier depuis l'url
            const filename = thing.imageUrl.split('/images/')[1];
            //On supprime le fichier du server
            fs.unlink(`images/${filename}`, () => {
                //Puis on supprime l'objet de la BDD
                Thing.deleteOne({
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
exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};