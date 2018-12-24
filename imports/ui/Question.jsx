import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router'

export default class Question extends Component {
  // increment() {
  //   Meteor.call('links.insert', "bla");
  //   this.setState({
  //     counter: this.state.counter + 1
  //   });
  // }

  render() {
    let page = FlowRouter.getParam('page');

    let hidden = "QuestionFrameHidden";
    if (this.props.state.question.hasOwnProperty('question')){
      if (this.props.state.showedAnswer <= 0 && page != "moderator") {
        hidden = "QuestionFrameAnswersHidden";
      }else{
        hidden = "";
      }
    }
   
    return (
      <div className={"QuestionFrame " + hidden}>
        <div className="Question"><p className="QuestionText">{this.props.text}</p></div>
        <div className="Answers">
          {this.props.children}
        </div>
      </div>
    );
  }
}
