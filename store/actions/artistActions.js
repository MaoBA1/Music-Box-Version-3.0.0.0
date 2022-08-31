export const GET_ALL_ARTISTS = 'GET_ALL_ARTISTS';
export const CREATE_ARTIST_PROFILE = 'CREATE_ARTIST_PROFILE';
export const GET_ARTIST_DATA = "GET_ARTIST_DATA";
export const CHANGE_ARTIST_IMAGE = "CHANGE_ARTIST_IMAGE";
export const CHANGE_ARTIST_DESCRIPTION = "CHANGE_ARTIST_DESCRIPTION";
export const CHANGE_ARTIST_MAING_GENER = "CHANGE_ARTIST_MAING_GENER";
export const ADD_GENER_TO_ADDITIONAL = "ADD_GENER_TO_ADDITION";
export const REMOVE_GENER_FROM_ADDITIONAL = "REMOVE_GENER_FROM_ADDITION";
export const ADD_SKILL_TO_ARTIST_SKILLS = "ADD_SKILL_TO_ARTIST_SKILLS";
export const REMOVE_SKILL_FROM_ARTIST_SKILLS = "REMOVE_SKILL_FROM_ARTIST_SKILLS";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";
export const GET_ARTIST_PLAYLISTS = "GET_ARTIST_PLAYLISTS";

import baseIpRequest from '../../src/ServerDev';



export const getAllArtistsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTISTS, data});
    }

} 


export const getAllArtistsAction = token =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/getAllArtists', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllArtistsDispatch(data));
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const createArtistDispatch = data => {
    return dispatch => {
        dispatch({type: CREATE_ARTIST_PROFILE, data});
    }

} 


export const createArtistAction = (token, details) =>{   
    console.log(details);
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/creatSuperUser', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data){
            dispatch(createArtistDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const getArtistDataDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_DATA, data});
    }

} 


export const getArtistDataAction = (token) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/getArtistData', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistDataDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const changeArtistImageDispatch = data => {
    return dispatch => {
        dispatch({type: CHANGE_ARTIST_IMAGE, data});
    }

} 


export const changeArtistImageAction = (token, details) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/changeArtistProfileImage', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data){
            dispatch(changeArtistImageDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const changeArtistDescriptionDispatch = data => {
    return dispatch => {
        dispatch({type: CHANGE_ARTIST_DESCRIPTION, data});
    }

} 


export const changeArtistDescriptionAction = (token, description) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/changeArtistDescription', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(description)
        })
        const data = await response.json(); 
        if(data){
            dispatch(changeArtistDescriptionDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const changeArtistMainGenerDispatch = data => {
    return dispatch => {
        dispatch({type: CHANGE_ARTIST_DESCRIPTION, data});
    }

} 


export const changeArtistMainGenerAction = (token, gener) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/changeArtistMainGener', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(gener)
        })
        const data = await response.json(); 
        if(data){
            dispatch(changeArtistMainGenerDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const addGenerToAdditionalDispatch = data => {
    return dispatch => {
        dispatch({type: ADD_GENER_TO_ADDITIONAL, data});
    }

} 


export const addGenerToAdditionalAction = (token, gener) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/addGenerToArtistAdditionalGeners', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(gener)
        })
        const data = await response.json(); 
        console.log(data);
        if(data){
            dispatch(addGenerToAdditionalDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const removeGenerFromAdditionalDispatch = data => {
    return dispatch => {
        dispatch({type: ADD_GENER_TO_ADDITIONAL, data});
    }

} 


export const removeGenerFromAdditionalAction = (token, gener) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/removeGenerToArtistAdditionalGeners', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(gener)
        })
        const data = await response.json(); 
        console.log(data);
        if(data){
            dispatch(removeGenerFromAdditionalDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const addSkillToArtistSkillsDispatch = data => {
    return dispatch => {
        dispatch({type: ADD_SKILL_TO_ARTIST_SKILLS, data});
    }

} 


export const addSkillToArtistSkillsAction = (token, skill) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/addSkillToArtistSkills', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(skill)
        })
        const data = await response.json(); 
        console.log(data);
        if(data){
            dispatch(addSkillToArtistSkillsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const removeSkillFromArtistSkillsDispatch = data => {
    return dispatch => {
        dispatch({type: REMOVE_SKILL_FROM_ARTIST_SKILLS, data});
    }

} 


export const removeSkillFromArtistSkillsAction = (token, skill) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/removeSkillFromArtistSkills', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(skill)
        })
        const data = await response.json(); 
        console.log(data);
        if(data){
            dispatch(removeSkillFromArtistSkillsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const createNewPlaylistDispatch = data => {
    return dispatch => {
        dispatch({type: CREATE_NEW_PLAYLIST, data});
    }

} 


export const createNewPlaylistAction = (token, details) =>{  
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/createNewPlaylist', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({playlist: details})
        })
        const data = await response.json(); 
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getArtistPlayListDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_PLAYLISTS, data});
    }

} 


export const getArtistPlaylistAction = (token) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/superUser/getArtistPlayList', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistPlayListDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

