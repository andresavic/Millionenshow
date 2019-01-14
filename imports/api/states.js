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
  console.log("BUILD STATE", jokersLeft);
  return {
    progress: progress,
    question: question,
    showedAnswer: showedAnswer,
    selectedAnswer: selectedAnswer,
    validateAnswer: validateAnswer,
    showWin: showWin,
    jokersLeft: jokersLeft,
    voting: { show: false, fake: true, a: 0, b: 0, c: 0, d: 0 }
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
  let s = state().state;
  let questionId = state().state.progress + 1;
  let question = Questions.findOne({ id: questionId });
  if (question === undefined) {
    console.log("Question not found: " + questionId)
    return;
  }
  s.progress = question.id;
  s.question = question;
  s.showedAnswer = 0;
  s.selectedAnswer = "";
  s.validateAnswer = false;
  s.showWin = false;
  setState(s);
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
      trigger("MS_CORRECT");

      if (s.progress <= 5) {
        trigger('MS_BGM_1');
      }else{
        trigger('MS_BGM_2');
      }
    }else{
      trigger("MS_WRONG");
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
    trigger('MS_TRANSITION');
    if (s.progress <= 5) {
      trigger('MS_BGM_1');
    }else{
      trigger('MS_BGM_2');
    }
  }else{
    nextQuestion();
  }
}

function selectAnswer(answer) {
  let s = state().state;
  s.selectedAnswer = answer.toUpperCase();
  s.voting.show = false;
  if (s.selectedAnswer != ""){
    if (s.progress >= 5) {
      trigger("MS_SELECT");
    }
  }
  setState(s);
}

function use5050(answers){
  console.log(">>>>>>>>>>>>>>>>>><")
  let s = state().state;
  s.jokersLeft = s.jokersLeft.filter(e => e !== '50:50');
  s.question[answers[0].toLowerCase()] = "";
  s.question[answers[1].toLowerCase()] = "";
  trigger("MS_JOKER1");
  setState(s);
}

function showAudience() {
  let s = state().state;
  if (s.voting.show === true){
    return;
  }
  s.voting.show = true;
  setState(s);
}

function useAudience(votes){
  let s = state().state;
  s.jokersLeft = s.jokersLeft.filter(e => e !== 'Audience');
  s.voting = { show: true, fake: true, a: 60, b: 40, c: 50, d: 80 };
  setState(s);

  setTimeout(() => {
    let s = state().state;
    s.jokersLeft = s.jokersLeft.filter(e => e !== 'Audience');
    votes.fake = false;
    s.voting = votes;
    setState(s);
  }, 1000);

  trigger("MS_JOKER2_VOTES");
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
  'states.showAudience'() {
    showAudience();
  },
  'states.useAudience'(votes) {
    console.log("use Audience", votes);
    useAudience(votes);
  }
});

function trigger(event) {
  if (!Meteor.isServer) {
    return;
  }
  console.log("Trigger " + event);
  var client = new osc.Client('192.168.1.100', 53000);
  client.send('/cue/' + event + '/start', 1, function () {
    client.kill();
  });
}
