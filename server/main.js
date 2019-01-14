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
      "Welches Tier von Bileam konnte einmal sprechen?",
      "Esel",
      "Pferd",
      "Kamel",
      "Dromedar",
      "A"
    );

    insertQuestion(2,
      "Wie viele Personen überlebten die Sintflut?",
      "3",
      "5",
      "8",
      "10",
      "C"
    );

    insertQuestion(3,
      "Wie ging der Jahrestext 2018 weiter?: Die auf Jehova hoffen, ",
      "werden den Satan besiegen",
      "werden neue Kraft gewinnen",
      "werden ewig leben",
      "haben keine Angst",
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
      "Welches der folgenden Ereignisse passiert als nächstes?",
      "Armageddon",
      "1000-Jahr-Herrschaft",
      "Paradies",
      "große Drangsal",
      "D"
    );

    insertQuestion(6,
      "Was Petrus zu Andreas war, das war Moses zu…",
      "Joseph",
      "Aaron",
      "Josua",
      "Amram",
      "B"
    );

    insertQuestion(7,
      "Welche der folgenden Personen hat gem. dem Bibelbericht niemanden auferweckt?",
      "Petrus",
      "Elia",
      "Samuel",
      "Paulus",
      "C"
    );

    insertQuestion(8,
      "Seit wie vielen Jahren regiert Jesus als König im Himmel?",
      "seit 104 Jahren",
      "seit 1985 Jahren",
      "seit 100 Jahren",
      "seit 2018 Jahren",
      "A"
    );

    insertQuestion(9,
      "Welchen Ausdruck findet man nicht in der Bibel?",
      "Sohn des Teufels",
      "Fauler",
      "Dummschwätzer",
      "Nichtsnutz",
      "C"
    );

    insertQuestion(10,
      "Wenn in der Bibel von Urim und Tummim die Rede ist, ist  vermutlich was gemeint?",
      "Engel",
      "Gebote auf Steintafeln",
      "Hebammen",
      "Lose um Jehova zu befragen",
      "D"
    );

    insertQuestion(11,
      "Jedes 50. Jahr feierten die Israeliten...",
      "das Purimfest",
      "ein Jubeljahr",
      "ein Trauerjahr",
      "das Trompetenfest",
      "B"
    );

    insertQuestion(12,
      "Welche Schokolade ist gleichzeitig auch der Name einer weiblichen biblischen Person?",
      "Milka",
      "Suchard",
      "Manner",
      "Leo",
      "A"
    );

    insertQuestion(13,
      "Die Füße in Daniels Standbild bestehen aus...",
      "Kupfer und Stein",
      "Gold und Silber",
      "Eisen und Ton",
      "Holz und Metall",
      "C"
    );

    insertQuestion(14,
      "Welches der folgenden Bibelbücher besteht aus mehr als einem Kapitel?",
      "Judas",
      "Maleachi",
      "3. Johannes",
      "Obadja",
      "B"
    );

    insertQuestion(15,
      "Welches Ereignis fand im Jahr 997 v.Chr. statt?",
      "Teilung des Königreiches",
      "Sintflut",
      "Auszug aus Ägypten",
      "Zerstörung Jerusalems",
      "A"
    );
  }
});
