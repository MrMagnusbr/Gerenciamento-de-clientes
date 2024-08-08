const firebaseConfig = {
  apiKey: "AIzaSyDlHG8G1KZMI8lMdY-fmKgBE8GwzDgu4rI",
  authDomain: "ifudeu-eb88f.firebaseapp.com",
  projectId: "ifudeu-eb88f",
  storageBucket: "ifudeu-eb88f.appspot.com",
  messagingSenderId: "925740779777",
  appId: "1:925740779777:web:91571fe64e0ebfeac7b300",
  measurementId: "G-MHJJJ1X7T4",
  databaseURL: "https://ifudeu-eb88f-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();