import { useState } from 'react';
import styles from './PersonalDetails.module.scss';
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Props {
  onNext: () => void;
  customerEmail: React.Dispatch<React.SetStateAction<string>>;
}

function PersonalDetailsForm({ onNext, customerEmail }: Props) {

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddCustomer = async () => {
    try {
      const customerRef = collection(db, "customers");
      const data = query(customerRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(data);

      if (!querySnapshot.empty) {
        setError("לקוח כבר קיים במערכת");
      } else {
        await setDoc(doc(db, "customers", email), {
          firstName: firstName,
          lastName: lastName,
          id: id,
          phoneNumber: phoneNumber,
          email: email.toLowerCase(),
        });
        onNext();
      };
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await handleAddCustomer();

    setLoading(false);
  };

  return (

    <form onSubmit={handleSubmit} className={styles.container}>
      <h2>פרטים אישיים</h2>
      <div className={styles.inputGroup}>
        <label htmlFor="firstName" className={styles.label}>שם פרטי</label>
        <input
          type="firstName"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={styles.input}
          placeholder="שם פרטי"
          maxLength={20}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lastName" className={styles.label}>שם משפחה</label>
        <input
          type="lastName"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={styles.input}
          placeholder="שם משפחה"
          maxLength={20}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="id" className={styles.label}>תעודת זהות</label>
        <input
          type='text'
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className={styles.input}
          placeholder="תעודת זהות"
          maxLength={10}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
          }}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="phoneNumber" className={styles.label}>מספר טלפון</label>
        <input
          type="phoneNumber"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={styles.input}
          placeholder="מספר טלפון"
          maxLength={10}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>אימייל</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            customerEmail(e.target.value)
          }}
          className={styles.input}
          placeholder="אימייל"
          maxLength={30}
          required
        />
      </div>

      <button type="submit" className={styles.button}>
        {loading ? "עובדים על זה..." : "אישור"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>

  )
};

export default PersonalDetailsForm;
