import { 
    SET_MUSIC_ON_BACKGROUND,
    SET_SONG_ON_BACKGROUND,
    SET_SONG_INDEX,    
    PLAY_FOR_FIRST_TIME,
    PAUSE_SONG,
    RESUME_SONG,
    PLAY_NEXT_SONG
 } from '../actions/appActions';


const initialState = {
    MusicOnBackGroundReducer:false,
    SongOnBackGroundReducer:null,
    SongIndexReducer: null,
    isPlaying: false,
    soundObj: null,
    playbackObj: null,
    currentAudio: {},
    playbackPosition: null,
    playbackDuration: null
}



export default (state = initialState, action) => {       
    switch (action.type) {
        case SET_MUSIC_ON_BACKGROUND:
            return {
                ...state,
                MusicOnBackGroundReducer: action.boolValue
            }
        case SET_SONG_ON_BACKGROUND:
            return {
                ...state,
                SongOnBackGroundReducer: action.list
            }
        case SET_SONG_INDEX:
            return {
                ...state,
                SongIndexReducer: action.index
            }        
        case PLAY_FOR_FIRST_TIME:
           return {
                ...state,
                playbackObj: action.playbackObj,
                soundObj: action.status,
                currentAudio: action.currentAudio,
                isPlaying: action.isPlaying,
                SongIndexReducer: action.index,
                SongOnBackGroundReducer: action.list,
                MusicOnBackGroundReducer: action.musicOnBackGround
            }
        case PAUSE_SONG:
            return {
                ...state,
                soundObj: action.status,
                isPlaying: action.isPlaying,
            }
        case RESUME_SONG:
            return {
                ...state,
                soundObj: action.status,
                isPlaying: action.isPlaying,
            }
        case PLAY_NEXT_SONG:
            return{
                ...state,
                soundObj: action.status,
                currentAudio: action.currentAudio,
                isPlaying: action.isPlaying,
                SongIndexReducer: action.index,
            }
        default:
            return state;
    }
}