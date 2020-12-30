const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Identifiant unique utilisateur créé par Mongo DB
    name:{ type: String, required:true}, // Nom de la sauce
    manufacturer : { type : String, required: true}, // Fabricant de la sauce
    description: { type: String, required: true }, //Description de la sauce
    mainPepper: { type: String, required: true }, // Principal ingrédient de la sauce
    imageUrl: { type: String, required: true }, //String de l'image téléchargé pare l'utilisateur
    heat: { type: Number, required: true }, // Nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, required: false, default : 0 },//Nombre d'utilisateurs qui aiment la sauce
    dislikes: { type: Number, required: false, default: 0 },//Nombre d'utilisateurs qui n'aiment pas la sauce
    usersLiked: { type: [String], required: false }, //Tableau d'identifiants des utilisateurs qui aiment la sauce
    usersDisliked: { type: [String], required: false },//Tableau d'identifiants des utilisateurs qui n'aiment pas la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);			
