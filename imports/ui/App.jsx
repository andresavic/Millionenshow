import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router'

import Question from './Question.jsx';
import Answer from './Answer.jsx';

import { withTracker } from 'meteor/react-meteor-data';
import States from '../api/states';

FlowRouter.route('/:page', {
  name: 'Home',
  action(params, queryParams) {
    console.log("Looking at a list?");
  }
});

const trophies = [
  "€ 100",
  "€ 200",
  "€ 300",
  "€ 400",
  "€ 500",
  "€ 1.000",
  "€ 2.000",
  "€ 5.000",
  "€ 10.000",
  "€ 15.000",
  "€ 30.000",
  "€ 75.000",
  "€ 150.000",
  "€ 300.000",
  "€ 1.000.000"
];


class App extends Component {


  state(){
    let state = this.props.states[this.props.states.length - 1];
    console.log(state);
    if (state === undefined){
      state = {
        id: 0,
        state: {
          progress: 0,
          question: {},
          showedAnswer: 0,
          selectedAnswer: "",
          validateAnswer: false,
          showWin: false,
          jokersLeft: [],
          voting: { show: false, fake: true, a: 0, b: 0, c: 0, d: 0 }
        }
      }
    }
    console.log("Render state", state.state);
    return state.state;
  }

  render5050() {
    console.log(this.state());
    if (!this.state().jokersLeft.includes('50:50')) {
      return;
    }
    return (
    <div className="Section">
     <select multiple ref={(input) => this.joker1 = input}>
       <option disabled={this.state().question.correct === 'A'} value="A">A: {this.state().question.a}</option>
       <option disabled={this.state().question.correct === 'B'} value="B">B: {this.state().question.b}</option>
       <option disabled={this.state().question.correct === 'C'} value="C">C: {this.state().question.c}</option>
       <option disabled={this.state().question.correct === 'D'} value="D">D: {this.state().question.d}</option>
     </select>
     <button onClick={() => {
      let values = [].filter.call(this.joker1.options, o => o.selected).map(o => o.value);
      Meteor.call('states.use5050', values) }}>50:50</button>
    </div>);
  }

  renderVotingRemote() {
    if (!this.state().jokersLeft.includes('Audience')) {
      return;
    }

    return (
    <div className="Section">
      <button onClick={() => { Meteor.call('states.showAudience') }}>Show</button>
       <input className="VotingInput" ref={(input) => this.votingA = input} type="number" step="1" />
       <input className="VotingInput" ref={(input) => this.votingB = input} type="number" step="1" />
       <input className="VotingInput" ref={(input) => this.votingC = input} type="number" step="1" />
       <input className="VotingInput" ref={(input) => this.votingD = input} type="number" step="1" />
     <button onClick={() => {
      Meteor.call('states.useAudience', { show: true, fake: false, a: this.votingA.value, b: this.votingB.value, c: this.votingC.value, d: this.votingD.value}) }}>VOTE</button>
    </div>);
  }

  renderVoting() {
    return (
      <div className={"Voting " + (this.state().voting.show === true ? '' : 'VotingHidden')}>
        <div className={"Counts " + (this.state().voting.fake === true ? 'CountsHidden' : '')}>
          <span>{this.state().voting.a}%</span>
          <span>{this.state().voting.b}%</span>
          <span>{this.state().voting.c}%</span>
          <span>{this.state().voting.d}%</span>
        </div>
        <div className="Bars">
          <div style={{ height: this.state().voting.a + "%" }} className="Bar BarA"></div>
          <div style={{ height: this.state().voting.b + "%" }} className="Bar BarB"></div>
          <div style={{ height: this.state().voting.c + "%" }} className="Bar BarC"></div>
          <div style={{ height: this.state().voting.d + "%" }} className="Bar BarD"></div>
        </div>
      </div>
    );
  }

  render() {
    let page = FlowRouter.getParam('page');
    console.log(page);

    let remote;
    if (page === 'remote') {
      remote = (<div>
        <div className="Section">
          <button onClick={() => { Meteor.call('states.undo') }}>Undo</button>

          <select multiple onChange={(e) => { Meteor.call('states.selectAnswer', e.target.value) }}>
            <option value="">Answer:</option>
            <option value="A">A: {this.state().question.a}</option>
            <option value="B">B: {this.state().question.b}</option>
            <option value="C">C: {this.state().question.c}</option>
            <option value="D">D: {this.state().question.d}</option>
          </select>

          <button onClick={() => { Meteor.call('states.nextStep') }}>Next step</button>
        </div>

        {this.render5050()}
        {this.renderVotingRemote()}
      </div>);
    }


    let canvas = (
      <Question state={this.state()} text={this.state().question.question}>
        <Answer state={this.state()} pos="A">{page === "moderator" || this.state().showedAnswer >= 1 ? this.state().question.a : ''}</Answer>
        <Answer state={this.state()} pos="B">{page === "moderator" || this.state().showedAnswer >= 2 ? this.state().question.b : ''}</Answer>
        <Answer state={this.state()} pos="C">{page === "moderator" || this.state().showedAnswer >= 3 ? this.state().question.c : ''}</Answer>
        <Answer state={this.state()} pos="D">{page === "moderator" || this.state().showedAnswer >= 4 ? this.state().question.d : ''}</Answer>
      </Question>
    );

    if (this.state().showWin === true){
      canvas = (
        <div className="QuestionFrame">
          <div className="Win">
            <span className="WinText">{trophies[this.state().progress - 1]}</span>
          </div>
        </div>
      );
    }

    return (<div className={page}>
      <div className="Canvas">
        {this.renderVoting()}
        {canvas}
      </div>
      {remote}
    </div>);
  }

}

export default App = withTracker(() => {
  return {
    states: States.find().fetch(),
  };
})(App);
