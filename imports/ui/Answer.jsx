import React, { Component } from 'react';
import DynamicFont from 'react-dynamic-font';
import { FlowRouter } from 'meteor/kadira:flow-router'

export default class Answer extends Component {

  render() {
    let page = FlowRouter.getParam('page');

    let selected = "";
    if (this.props.state.selectedAnswer === this.props.pos){
      selected = this.props.pos + "-Selected";
    }

    let correct = "";
    if (this.props.state.validateAnswer && this.props.state.question.correct === this.props.pos) {
      correct = this.props.pos + "-Correct";
    }

    let marked = "";
    if (page === "moderator" && this.props.state.question.correct === this.props.pos){
      marked = "LetterMarked";
    }
    return (
      <div className={"Answer " + this.props.pos + " " + selected + " " + correct}>
        <div className={"Letter " + marked}>{this.props.pos}:</div><span className="AnswerText"><DynamicFont content={this.props.children} /></span>
      </div>
    );
  }
}
