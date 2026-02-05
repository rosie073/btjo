const firebaseConfig = {
  apiKey: "AIzaSyAVWEjLyQK-dhXXQoYF4x5iQWWxoKBCMN4",
  authDomain: "btjo-b640b.firebaseapp.com",
  projectId: "btjo-b640b",
  storageBucket: "btjo-b640b.firebasestorage.app",
  messagingSenderId: "229710976107",
  appId: "1:229710976107:web:fc44aa58b65e8c285f0d2e",
  measurementId: "G-4Z37KZXV5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);