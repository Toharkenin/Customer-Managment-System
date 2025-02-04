import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as sgMail from '@sendgrid/mail';

// Initialize Firebase Admin SDK
admin.initializeApp();

sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

export const monthlyReminder = onSchedule('every 1 months', async (event) => {
    console.log('Running monthly reminder function...');

    const customersRef = admin.firestore().collection('customers');
    const snapshot = await customersRef.get();

    if (snapshot.empty) {
        console.log('No customers found');
        return;
    }

    const currentDate = new Date();

    snapshot.forEach(async (doc) => {
        const customer = doc.data();

        if (!customer.lastTreatmentDate) return;

        const lastTreatmentDate = customer.lastTreatmentDate.toDate(); // Ensure Firestore timestamp is converted to Date
        const diffTime = Math.abs(currentDate.getTime() - lastTreatmentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Calculate difference in days

        if (diffDays >= 30) {
            console.log(`Reminder sent to ${customer.name}`);
            await triggerAdminPopup();
        }
    });
});

// Function to trigger admin popup in Firestore
const triggerAdminPopup = async () => {
    const adminRef = admin.firestore().collection('admins').doc('admin-id'); // Replace with the actual admin document
    const doc = await adminRef.get();

    if (!doc.exists) {
        console.log('Admin not found');
        return;
    }

    // Update the admin's document to signal that a popup is required
    await adminRef.update({
        popupNotification: {
            message: "Reminder: Some customers are due for treatment!",
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        }
    });

    console.log('Popup notification triggered for admin');
};