export const GET_USER_DATA = 'GET_USER_DATA';
export const LOGIN = "LOGIN";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

import baseIpRequest from '../../src/ServerDev';


export const getUserDataDispatch = data => {
    return dispatch => {
        dispatch({type: GET_USER_DATA, data});
    }

} 


export const getUserDataAction = token =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getUserData', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getUserDataDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const loginDispatch = data => {
    return dispatch => {
        dispatch({type: LOGIN, data});
    }

} 


export const loginAction = details =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/login', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data.status){
            dispatch(loginDispatch(data));
            return {
                token: data.token,
                isItFirstUse: data.isItFirstUse
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const updateDispatch = data => {
    return dispatch => {
        dispatch({type: UPDATE_PROFILE, data});
    }

} 


export const updateProfileAction = (token, details) =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/updateRegularAccount', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data){
            dispatch(updateDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}