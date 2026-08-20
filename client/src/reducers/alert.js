import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
    const { type, payload } = action

    // we are evaluating a type of action, we can have multiple cases
    switch(type) {
        // we want to evaluate the action.type with cases
        case SET_ALERT:
            // return a new array with the old state + the new alert using spread operator.
            return [...state, payload];
        case REMOVE_ALERT:
            // filter out the alert id we want to remove
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}