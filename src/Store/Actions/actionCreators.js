import axios from "axios";
import * as ActionTypes from "./actionTypes";

export const quizStart = () => {
    return {
        type: ActionTypes.QUIZ_START
    }
}

export const quizSuccess = (data) => {
    return {
        type: ActionTypes.QUIZ_SUCCESS,
        value: data
    }
}

export const quizNext = (data, nextID) => {
    return {
        type: ActionTypes.QUIZ_NEXT,
        value: {data, nextID} 
    }
}

export const quiz = ( getURL ) => {

    return dispatch => {
        dispatch(quizStart());
        axios.get(getURL)
        .then(response => dispatch(quizSuccess(response.data)))
        .catch( err => dispatch(quizFail(err.response.data.error)));
    }
}

export const nextQ = ( results, nextID ) => {
    return dispatch => {
        dispatch(quizNext( results, nextID ));
    }
}

export const quizFail = (err) => {
    return {
        type: ActionTypes.QUIZ_FAIL,
        error: err
    }
}