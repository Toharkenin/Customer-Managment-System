import express from 'express';
import cron from 'node-cron';
import admin from 'firebase-admin';

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });


const db = admin.firestore();


app.get('/', (req, res) => {
  res.send('Cron job is running!');
});


cron.schedule('0 10 1 * *', async () => {
  console.log('⏰ Running monthly cron job...');
  
  const customersRef = db.collection('customers');
  const snapshot = await customersRef.get();

  snapshot.forEach(doc => {
    const customer = doc.data();
//test//
    console.log(`🔔 Sending reminder to ${customer.name}`);
    
   
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
