import { GET_USER_DATA } from '../actions/userActions';

const initialState = null;


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_USER_DATA:
            return {
                ...state,       
                UserReducer: action.data
            }
        default:
            return state;
    }
}