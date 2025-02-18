/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/
use('test');

// Para encontrar todos os usuários
db.getCollection('users').find().toArray();

// Para encontrar um usuário específico pelo nome de usuário
db.getCollection('users').findOne({ username: 'nome_de_usuario' }); 
/* db.getCollection('users').findOne({ username: 'bianca' });*/

// Para adicionar um novo usuário (registro)
/* db.getCollection('users').insertOne({
  username: 'novo_usuario',
  salt: 'salt_gerado',
  hash: 'hash_gerado',
  __v: 1
}); */

// Para deletar um usuário específico pelo nome de usuário
db.getCollection('users').deleteOne({ username: 'nome_de_usuario' });