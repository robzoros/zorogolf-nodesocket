
const Partidas = new Mongo.Collection('partidas');
const Campos = new Mongo.Collection('campos');
const Mazos = new Mongo.Collection('mazos');

export default Partidas;
export {Campos, Mazos};

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('partida', (id) => {
    check(id, String);
    return Partidas.find({_id: id});
  });

  Meteor.publish('partidas', () => {
    return Partidas.find({});
  });
}
