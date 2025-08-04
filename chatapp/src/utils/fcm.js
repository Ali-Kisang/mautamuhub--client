// 📌 fcm.js (Firebase Cloud Messaging setup)
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  try {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("Unable to get permission to notify.", err);
  }
}

export function onMessageListener(callback) {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    callback(payload);
  });
}
