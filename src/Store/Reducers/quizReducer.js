import * as actionTypes from "../Actions/actionTypes";
import { quizUtility } from "../quizUtility";

// init quiz state here
const quizState ={
    questionData: null,
    currentQuestion: null,
    loading: true,
    results: [],
    score: 0,
    totalQ: null,
    currentQ: 0
}

const quizReducer = (state = quizState, action) => {

    const quizStart = (state, action) => {
        return quizUtility(state, {
            loading: false
        })
    }

    const quizSuccess = (state, action) => {
        const reqValues = [];
        for(let key in {...action.value.results}){
            reqValues.push({
                id: key,
                config: {...action.value.results[key]}
            });
        }
        return quizUtility(state, {
            currentQuestion: reqValues[state.currentQ],
            loading: false,
            totalQ: action.value.results.length,
            currentQ: reqValues[state.currentQ].id,
            questionData: {...action.value.results}
        })
    }

    const quizNext = (state, action) => {
        console.log(action.value.data.answerStatus);
        const reqValues = [];
        for(let key in {...state.questionData}){
            reqValues.push({
                id: key,
                config: {...state.questionData[key]}
            });
        }
        let resultValue = [...state.results];
        resultValue.push(action.value.data);
        return quizUtility(state, {
            results: resultValue,
            currentQ: action.value.nextID,
            score: parseInt(state.score) + parseInt(action.value.data.answerStatus? 1 : 0),
            currentQuestion: reqValues[parseInt(state.currentQ)+1]
        })
    }

    const quizFail = (state, action) => {
        return quizUtility(state, {
            error: action.error.message,
            loading: false
        })
    }

    switch (action.type) {
        case actionTypes.QUIZ_START:
            return quizStart(state, action);
        case actionTypes.QUIZ_SUCCESS:
            return quizSuccess(state, action);
        case actionTypes.QUIZ_NEXT:
            return quizNext(state, action);
        case actionTypes.QUIZ_FAIL:
            return quizFail(state, action);
        default:
            return state;
    }
}

export default quizReducer;
