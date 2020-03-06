import React from "react";
import * as ActionTypes from "../../Store/Actions/actionTypes";
import { connect } from "react-redux";
import "./quiz.css";
import ErrorBoundaries from "../ErrorBoundaries/ErrorBoundaries";
import { Loader } from "../Helpers/Loader/Loader";
import * as actions from "../../Store/Actions/index";

class Quiz extends React.Component{

    state = {
        time: {
            seconds: 9,
            minutes: 0,
            hours: 0
        },
        timeOut: true
    }
    
    shuffle = array => {
        return array.sort(() => Math.random() - 0.5);
    }

    timer = () => {
        /* let time = {...this.state.time}; */
            /* let timer = setInterval(() => {
                if(this.state.timeOut){
                    document.getElementById('timer').innerHTML= this.state.time.minutes + ":" + this.state.time.seconds;
                }else{
                    document.getElementById('timer').innerHTML = <h4>Session Over</h4>;
                }
                time.seconds--;
                if (time.seconds < 0) {
                    let secUpdates = {
                    ...this.state.time,
                    seconds: 59
                }
                this.setState({time: secUpdates});
                time.minutes--;
                if(time.minutes < 0){
                    clearInterval(timer);
                    let minUpdates = {
                        ...this.state.time,
                        minutes: "00",
                        seconds: "00",
                        
                    }
                    this.setState({time: minUpdates, timeOut: false});
                }
                clearInterval(timer);
            }
        }, 1000); */
    
}
    
    nextHandler = (selectAns, correctAns) =>{
        let nextQuestion = {
            answerStatus: correctAns === selectAns,
            correctAns: correctAns,
            selectAns: selectAns
        };
        
        this.props.nextQuestion(nextQuestion, parseInt(this.props.currentQ)+1);
    }

    componentDidMount(){
        let gameAPI = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
        this.props.Authentication(gameAPI);
    }

    render(){
        let currentQuestion = [];
        for(let values in this.props.currentQuestion){
            currentQuestion[values] = this.props.currentQuestion[values];
        }
        let arrElem = {...currentQuestion.config};        
        let arrOptions = Object.values({...arrElem.incorrect_answers});
        arrOptions.push(arrElem.correct_answer);
        let options = this.shuffle(arrOptions);
        let RenderValue = <Loader />;

            if(currentQuestion.id && this.state.timeOut){
                RenderValue = <div className="question">
                <h2>Round {parseInt(currentQuestion.id)+1}/{this.props.totalQ}</h2> 
                {/* <div id="timer"></div> */}
                <h3>{arrElem.question}</h3>
                {/* {this.timer()} */}
                <ul>
                    {options.map( (elem, ind) => {
                        return <li 
                        onClick={()=> this.nextHandler(elem, arrElem.correct_answer)} 
                        key={ind}>
                            {elem}
                        </li>
                    })}
                </ul>
            </div>;
        }
        if(this.props.results.length == this.props.totalQ ){
            RenderValue = <h1>YOUR SCORE  - {Math.floor((this.props.score / this.props.totalQ) * 100)}%</h1>
        }
        return <ErrorBoundaries>{RenderValue}</ErrorBoundaries>;
    }
}

const getStatesToProps = state => {
    return {
        currentQuestion: state.currentQuestion,
        currentQ: state.currentQ,
        totalQ: state.totalQ,
        score: state.score,
        results: state.results
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    Authentication: (gameAPI) => dispatch(actions.quiz(gameAPI)),
    nextQuestion: (nextQuestion, nextID) => dispatch(actions.nextQ(nextQuestion, nextID))

  }
}

export default connect(getStatesToProps, mapDispatchToProps)(Quiz);