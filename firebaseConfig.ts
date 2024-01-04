import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBV2t1mZTFBOlYcMV5d0xstojiOesVblrQ',
  authDomain: 'cit-490-846c7.firebaseapp.com',
  projectId: 'cit-490-846c7',
  storageBucket: 'cit-490-846c7.appspot.com',
  messagingSenderId: '774298954456',
  appId: '1:774298954456:web:84cc61cf5ff0ae7f7185ad',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
