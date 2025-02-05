import { setGlobalOptions } from "firebase-functions/v2";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

initializeApp(); 
setGlobalOptions({ region: "us-central1" });

const db = getFirestore();

export const sendMonthlyNotifications = onSchedule("every 24 hours", async () => {
  const today = new Date();
  today.setMonth(today.getMonth() - 1); 

  const customersRef = db.collection("customers");
  const snapshot = await customersRef
    .where("lastTreatment", "<=", Timestamp.fromDate(today))
    .get();

  if (snapshot.empty) {
    console.log("No customers need reminders today.");
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    const customer = doc.data();
    const notificationRef = db.collection("notifications").doc();

    batch.set(notificationRef, {
      adminRead: false,
      message: `Reminder: ${customer.name} had a treatment one month ago.`,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log(`Notification added for ${customer.name}`);
  });

  await batch.commit();
});
