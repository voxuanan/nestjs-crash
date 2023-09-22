import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCsYgy1QmwIk0Mt0YnklUSmJ5FLRTnVCcw",
    authDomain: "fir-test-8d865.firebaseapp.com",
    databaseURL: "https://fir-test-8d865-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-test-8d865",
    storageBucket: "fir-test-8d865.appspot.com",
    messagingSenderId: "940504984630",
    appId: "1:940504984630:web:ebc4b9962a50ae10743c97",
    measurementId: "G-76YWG5SCWY",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export function getTokenKey() {
    getToken(messaging, {
        vapidKey:
            "BKzwckK8yiWU32U0jqDRsu-yi9gxm7WA2gl0CyGBdEoIQZBVydTgWpfnBTdpj7DLklyr0viSzTaoyGMuq3N3nzE",
    }).then((currentToken) => {
        if (currentToken) {
            console.log("currentToken: ", currentToken);
        } else {
            console.log("Can not get token");
        }
    });
}

export const auth = getAuth(app);
