const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/**
 * Schema de usuário para autenticação
 * É mantido simples pois o passport-local-mongoose adiciona automaticamente
 * os campos necessários para autenticação
 */
const UserSchema = new Schema({
  // O schema está vazio porque o passport-local-mongoose
  // irá adicionar automaticamente:
  // - username (string)
  // - password (hash e salt)
  // - métodos para validação, registro e autenticação
})

/**
 * Adiciona os campos e métodos do passport-local-mongoose ao schema
 * Isso inclui:
 * - Campo username
 * - Campo password (com hash e salt)
 * - Métodos de autenticação (register, authenticate, etc.)
 * - Métodos de serialização/desserialização para sessions
 */
UserSchema.plugin(passportLocalMongoose)

// Exporta o modelo User com os métodos adicionados pelo plugin
module.exports = mongoose.model('User', UserSchema)