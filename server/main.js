import { Meteor } from 'meteor/meteor';
import Questions from '../imports/api/questions';
import  '../imports/api/states';


function insertQuestion(id, question, a, b, c, d, correct) {
  Questions.insert({
    id: id,
    question: question,
    a: a,
    b: b,
    c: c,
    d: d,
    correct: correct.toUpperCase()
  });
}

Meteor.startup(() => {
  if (Questions.find().count() === 0) {
    insertQuestion(1, 
      "Auf welchem Tier ritt Bileam, als ihm ein Engel den Weg versperrte?", 
      "Esel", 
      "Pferd",
      "Kamel", 
      "Dromedar", 
      "A"
    );

    insertQuestion(2,
      "Wie viele Personen überlebten die Sintflut?",
      "2",
      "5",
      "8",
      "10",
      "C"
    );

    insertQuestion(3,
      "Wie ging der Jahrestext 2018 weiter?: Die auf Jehova hoffen, ",
      "werden den Satan besiegen",
      "werden neue Kraft gewinnen",
      "haben keine Angst",
      "10",
      "B"
    );

    insertQuestion(4,
      "Wie geht folgendes Lied weiter? \"Dies ist der Weg, er führt zu wahrem Glück, verlass ihn nie, …\"",
      "und kehre nicht zurück",
      "auch nicht nur für ein Stück",
      "ja geh nicht von ihm weg",
      "ja keinen Augenblick",
      "D"
    );
  
    insertQuestion(5,
      "Welche der folgenden Personen hat gem. dem Bibelbericht niemanden auferweckt?",
      "Petrus",
      "Elia",
      "Samuel",
      "Paulus",
      "C"
    );
  }
});
