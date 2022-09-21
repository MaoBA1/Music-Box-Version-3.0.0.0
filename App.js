import React, { useState, useEffect, useCallback } from 'react'
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import AppBackGround from './AppBackGround';
import GetUserDataReducer from './store/reducers/userReducers';
import GetGenresReducer from './store/reducers/generReducer';
import GetPostReducer from './store/reducers/postReducer';
import GetArtistsReducer from './store/reducers/artistReducer';
import SongReducers from './store/reducers/songReducer';
import AppReducers from './store/reducers/appReducers';
import AlbumReducers from './store/reducers/albumReducer';
import * as SplashScreen from 'expo-splash-screen';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCuHUhB84qcXK2i59tEXlXsmShnNO2iu-4",
  authDomain: "musicboxapp-aad61.firebaseapp.com",
  projectId: "musicboxapp-aad61",
  storageBucket: "musicboxapp-aad61.appspot.com",
  messagingSenderId: "474894645241",
  appId: "1:474894645241:web:596e942795aabc0d27af28"
};


if(firebase.apps.length == 0) {
  console.log('1');
  const app = firebase.initializeApp(firebaseConfig);
}

const rootReducer = combineReducers({
    UserReducer: GetUserDataReducer,
    GenerReducer: GetGenresReducer,
    Post: GetPostReducer,
    ArtistsReducer: GetArtistsReducer,
    SongReducer: SongReducers,
    AppReducer: AppReducers,
    AlbumReducers: AlbumReducers
}) 

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const loadFontsFromAssets = () => {
  return Font.loadAsync({
    'Baloo2-Bold' : require('./assets/fonts/Baloo2-Bold.ttf'),
    'Baloo2-ExtraBold' : require('./assets/fonts/Baloo2-ExtraBold.ttf'),
    'Baloo2-Medium' : require('./assets/fonts/Baloo2-Medium.ttf'),
    'Baloo2-Regular' : require('./assets/fonts/Baloo2-Regular.ttf'),
    'Baloo2-SemiBold' : require('./assets/fonts/Baloo2-SemiBold.ttf'),
    'Baloo2-VariableFont_wght' : require('./assets/fonts/Baloo2-VariableFont_wght.ttf'),
  });
}


export default function App() {
  const [isFontsLoading,setIsFontsLoading] = useState(false);
  const [isMusicInTheBackGround, setIsMusicInTheBackground] = useState(false);
  


  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await loadFontsFromAssets();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


 

  return (
      <Provider store={store}>
        <AppBackGround/>
      </Provider>
  );
}


