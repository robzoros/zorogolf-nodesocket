
const Partidas = new Mongo.Collection('partidas');
const Campos = new Mongo.Collection('campos');
const Mazos = new Mongo.Collection('mazos');

export default Partidas;
export {Campos, Mazos};

