/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/pubsub';

// Initialize Firebase Admin SDK
admin.initializeApp();

// This function will be triggered by a Pub/Sub event or a scheduled time.
export const monthlyReminder = functions.pubsub.schedule('0 0 1 * *') // Triggers on the 1st day of every month at midnight
    .onRun(async (context) => {
        console.log('Sending monthly reminder notifications...');

        // Get all customers from Firestore
        const customersRef = admin.firestore().collection('customers');
        const snapshot = await customersRef.get();

        if (snapshot.empty) {
            console.log('No customers found');
            return;
        }

        // Loop through all customers and check their last treatment date
        snapshot.forEach(async (doc) => {
            const customer = doc.data();
            const lastTreatmentDate = customer.lastTreatmentDate.toDate(); // Make sure it's a Firestore Timestamp object

            // Check if it's been a month since the last treatment
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate.getTime() - lastTreatmentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

            if (diffDays >= 30) {
                // Send a notification (this can be customized to use Firebase Cloud Messaging)
                await sendNotification(customer.deviceToken, 'It\'s time for your next treatment!');
                console.log(`Sent reminder to customer: ${customer.name}`);
            }
        });
    });

// Function to send a notification (this is just an example using FCM)
const sendNotification = async (deviceToken: string, message: string) => {
    const payload = {
        notification: {
            title: 'Monthly Reminder',
            body: message,
        },
    };

    try {
        await admin.messaging().sendToDevice(deviceToken, payload);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};