import { Mongo } from 'meteor/mongo';

export default Links = new Mongo.Collection('links');

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}