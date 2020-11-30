const Sauce = require('../models/Sauce');
const fs = require('fs'); // package node pour supprimer la photo d'un objet

// Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Caractéristiques de l'Url d'images
});
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));

};
//Obtenir une sauce spécifique
exports.getOneSauce =(req, res, next) => { 
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
//Modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // Crée un objet sauceObjet pour mettre à jour l'URI de l'image
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  //Supprimer les sauces
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  // Récupérer la base de donnée de toutes les sauces
  exports.getAllSauces =(req, res, next) => {
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

// Gestion des likes pour les sauces
exports.likeSauce = (req, res) => {
  switch (req.body.like) {  //L'instruction Switch sert à vérifier une variable en fonction d'une liste de valeurs avec comme requête l'objet (body) et la propriété (like)
    case 0: // 1er cas :  L'utilisateur annule ce qu'il aime ou n'aime pas --> il faut donc 2 instructions
      Sauce.findOne({ _id: req.params.id }) //1- On recherche une sauce spécifique avec une promise
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) { //2-On donne une première instruction si l'utilisateur aime la sauce : on passe par l'objet sauce et le modèle de données usersLiked et on recherche l'utilisateur avec l'identifiant utilisateur
            Sauce.updateOne( //3-On sauvegarde dans le tableau avec une promise et 2 paramètres
              { _id: req.params.id }, //premier paramètre on recherche  l'id produit
              { // second paramètre les likes et la gestion de l'utilisateur dans la base donnée puis la sauvegarde dans l'id produit
                $inc: { likes: -1 },//4-On utilise la fonction $inc de Mongo DB pour l'incrémentation. Dans ce cas, si j'aime = 0, on enlève le like
                $pull: { usersLiked: req.body.userId }, //5- On utilise la fonction $pull de mongo DB pour supprimer l'utilisateur de la base de donnée. ref : https://docs.mongodb.com/manual/reference/operator/update/pull/
                _id: req.params.id,//6 Sauveagrde dans l'id produit
              },
            )
              .then(() => { // instruction validée
                res
                  .status(201)
                  .json({ message: 'Ton avis a été pris en compte!' });
              })
              .catch((error) => { // instruction non valide
                res.status(400).json({ error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {//même procédé que précédemment pour la seconde instruction l'utilisateur qui n'aime pas la sauce 
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 }, // on enlève un dislike
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              },
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: 'Ton avis a été pris en compte!' });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
        })
        .catch((error) => {// On ne trouve pas la sauce --> erreur
          res.status(404).json({ error });
        });
      break;
    case 1:// L'utilisateur aime la sauce
      Sauce.updateOne(  // instruction
        { _id: req.params.id },
        {
          $inc: { likes: 1 }, // on rajoute un like
          $push: { usersLiked: req.body.userId }, // on rajoute l'utilisateur à la base de donnée en utilisant la fonction push de MongoDB ref: https://docs.mongodb.com/manual/reference/operator/update/push/
          _id: req.params.id,
        },
      )
        .then(() => { // instruction validée
          res.status(201).json({ message: 'Ton like a été pris en compte!' });
        })
        .catch((error) => { // instruction non valide
          res.status(400).json({ error });
        });
      break;
    case -1: // L'utilisateur n'aime pas la sauce - Même méthode que précédemment
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 }, // on rajoute un dislike
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        },
      )
        .then(() => {
          res
            .status(201)
            .json({ message: 'Ton dislike a été pris en compte!' });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    default:
      console.error('mauvaise requête');// Mauvaise requête dans la gestion des likes
  }
};

