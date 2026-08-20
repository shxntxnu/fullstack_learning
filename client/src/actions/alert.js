import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    // randomly generate universal ID
    const id = uuidv4();
    // call setalert
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);  // remove alert after 5 seconds
};