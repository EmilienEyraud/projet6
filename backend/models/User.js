const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passwordStrength = require('check-password-strength'); // Validation de la force des mots de passe


const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,}
});

const password = passwordStrength(
  {
    id: 2, 
    value: "Strong",
    contains: [{'message': 'lowercase'},{'message': 'uppercase'},{'message': 'symbol'},{'message': 'number'}],
    length: 10
  }
)

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema), password;