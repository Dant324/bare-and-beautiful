// Run this in your 'admin' folder on your PC
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const uid = "hgZ60JEPceafHTi59UxGB7eJNxd2"; // Get this from Firebase Auth tab

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => console.log("✅ Admin badge granted! Log out and back in on your site."));