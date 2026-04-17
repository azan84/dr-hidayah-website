// =============================================================
// Thermodynamics Quiz — Firebase configuration
// -------------------------------------------------------------
// HOW TO SET UP (one-time, ~10 minutes):
//
// 1. Go to https://console.firebase.google.com/ and click
//    "Add project" (name it e.g. "thermo-quiz").
//    - Disable Google Analytics (not needed).
// 2. On the project home page, click the </>  icon to add a
//    Web App. Give it a nickname (e.g. "quiz-web"). Do NOT
//    tick "Firebase Hosting". Click "Register app".
// 3. Firebase shows a snippet with a `firebaseConfig = { ... }`.
//    COPY the values into FIREBASE_CONFIG below.
// 4. In the Firebase console sidebar, click
//    Build  ->  Firestore Database  ->  Create database.
//    - Choose "Start in production mode".
//    - Pick location: asia-southeast1 (Singapore) for Malaysia.
// 5. Once created, go to the "Rules" tab, paste the rules below
//    (they restrict the collection so nobody can cheat the
//    schema), then click Publish:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /thermoQuizLB/{doc} {
//          allow read: if true;
//          allow create: if
//            request.resource.data.name is string
//            && request.resource.data.name.size() > 0
//            && request.resource.data.name.size() <= 20
//            && request.resource.data.score is number
//            && request.resource.data.score >= 0
//            && request.resource.data.score <= 12000
//            && request.resource.data.correct is number
//            && request.resource.data.total is number
//            && request.resource.data.avgTime is number;
//          allow update, delete: if false;
//        }
//      }
//    }
//
// 6. Save this file (quiz-config.js) with your own keys below,
//    commit, and push. The quiz will automatically switch from
//    local-only leaderboard to the shared Firebase leaderboard.
// =============================================================

window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCbJTrp15up62yvUU79Tqe7WXL1ZDtaJ0g",
  authDomain:        "thermo-quiz.firebaseapp.com",
  projectId:         "thermo-quiz",
  storageBucket:     "thermo-quiz.firebasestorage.app",
  messagingSenderId: "556990589781",
  appId:             "1:556990589781:web:aecc4da595fc1b8acf9ddc",
  measurementId:     "G-WW3D7F6K44"
};

// Firestore collection name (change if you run multiple quizzes)
window.QUIZ_LEADERBOARD_COLLECTION = "thermoQuizLB";

// Until you fill in real keys, this flag stays false and the
// quiz falls back to a per-device localStorage leaderboard.
window.FIREBASE_ENABLED = !(
  !window.FIREBASE_CONFIG.apiKey ||
  window.FIREBASE_CONFIG.apiKey.indexOf("PASTE_") === 0
);
