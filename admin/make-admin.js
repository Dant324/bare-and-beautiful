const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// 1. Connect to your Firebase Project
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const EMAIL_TO_SET_ADMIN = "michaelmurag7@gmail.com"; 

async function grantAdmin() {
  console.log("Searching for user...");

  try {
    // We are looking in the "Admins" collection for your email
    const usersRef = db.collection("Admins");
    const snapshot = await usersRef.where("email", "==", EMAIL_TO_SET_ADMIN).get();

    if (snapshot.empty) {
      // If you aren't in the list, we add you
      await usersRef.add({
        email: EMAIL_TO_SET_ADMIN,
        admin: true
      });
      console.log(`✨ Success: Created a new admin entry for ${EMAIL_TO_SET_ADMIN}`);
    } else {
      // If you are already in the list, we make sure the 'admin' flag is true
      snapshot.forEach(async (doc) => {
        await doc.ref.update({ admin: true });
      });
      console.log(`✨ Success: Updated existing entry for ${EMAIL_TO_SET_ADMIN}`);
    }

    console.log("🚀 You are now officially an admin in the database.");
    process.exit();
  } catch (error) {
    console.error("❌ Something went wrong:", error);
    process.exit(1);
  }
}

grantAdmin();