import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Questions from './questions';
export default States = new Mongo.Collection('states');
var osc = require('node-osc');

const jokers = [
  "50:50",
  "Audience",
  "Phone",
  "Ask"
];

function buildState(progress, question, showedAnswer, selectedAnswer, validateAnswer, showWin, jokersLeft){
  return {
    progress: progress,
    question: question,
    showedAnswer: showedAnswer,
    selectedAnswer: selectedAnswer,
    validateAnswer: validateAnswer,
    showWin: showWin,
    jokersLeft: jokersLeft
  };
}

function state(){
  let state = States.findOne({}, { sort: { id: -1 }, limit: 1 });
  console.log("S", state);
  if (state === undefined){
    state = {
      id: 0,
      state: buildState(0, {}, 0, "", false, false, jokers)
    }
  }
  return state;
}

function setState(newState) {
  States.insert({
    id: ((state().id + 1) || 1),
    state: newState
  });
}

function nextQuestion() {
  console.log(state().state.progress);
  let questionId = state().state.progress + 1;
  let question = Questions.findOne({ id: questionId });
  if (question === undefined) {
    console.log("Question not found: " + questionId)
    return;
  }
  setState(
    buildState(question.id, question, 0, "", false, false, [])
  );
}

function nextStep() {
  let s = state().state;
  if (s.progress === 0){
    nextQuestion();
  } else if (s.showedAnswer < 4){
    s.showedAnswer = s.showedAnswer + 1;
    setState(s);
  } else if (s.selectedAnswer === ""){

  } else if (s.validateAnswer === false && s.showWin === false && s.question.hasOwnProperty('question')) {
    s.validateAnswer = true;
    if (s.selectedAnswer === s.question.correct) {
      trigger("correct");
    }else{
      trigger("wrong");
    }
    setState(s);
  } else if (s.validateAnswer === true && s.showWin === false && s.question.hasOwnProperty('question')) {
    s.showWin = true;
    setState(s);
  } else if (s.showWin === true && s.question.hasOwnProperty('question')) {
    s.question = {};
    s.validateAnswer = false
    s.showWin = false;
    setState(s);
  }else{
    nextQuestion();
  }
}

function selectAnswer(answer) {
  let s = state().state;
  s.selectedAnswer = answer.toUpperCase();
  if (s.selectedAnswer != ""){
    trigger("select");
  }
  setState(s);
}

function use5050(answers){
  console.log(">>>>>>>>>>>>>>>>>><")
  let s = state().state;
  s.question[answers[0].toLowerCase()] = "";
  s.question[answers[1].toLowerCase()] = "";
  trigger("joker1");
  setState(s);
}

function undo() {
  States.remove({ _id: state()._id });
}

Meteor.methods({
  'states.undo'() {
    console.log("Undo state");
    undo();
  },
  'states.nextStep'() {
    console.log("Next step");
    nextStep();
  },
  'states.nextQuestion'() {
    console.log("Next question");
    nextQuestion();
  },
  'states.selectAnswer'(answer) {
    console.log("Next selectAnswer", answer);
    selectAnswer(answer);
  },
  'states.use5050'(answers) {
    console.log("User 5050", answers);
    if (answers.length === 2){
      use5050(answers);
    }
  },
});

function trigger(event) {
  if (!Meteor.isServer) {
    return;
  }
  switch (event) {
    case 'correct':
      console.log("Trigger correct");
      var client = new osc.Client('10.0.1.11', 53000);
      client.send('/cue/1/start', 1, function () {
        client.kill();
      });
      break;
    case 'wrong':
      console.log("Trigger wrong");
      var client = new osc.Client('10.0.1.11', 53000);
      client.send('/cue/wrong/start', 1, function () {
        client.kill();
      });
      break;

    case 'select':
      console.log("Trigger select");
      var client = new osc.Client('10.0.1.11', 53000);
      client.send('/cue/select/start', 1, function () {
        client.kill();
      });
      break;
    default:
      console.log("noe vent")
  }

}
