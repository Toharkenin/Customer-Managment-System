
import { useEffect, useState } from 'react';
import styles from './EditCustomer.module.scss';
import { useParams } from 'react-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
function EditCustomer() {

    const { id } = useParams();
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    //get users info
    useEffect(() => {
        if (!id) return;

        const fetchCustomer = async () => {
            try {
                const customerRef = doc(db, 'customers', id);
                const customerSnap = await getDoc(customerRef);

                if (customerSnap.exists()) {
                    const data = customerSnap.data();
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setPhoneNumber(data.phoneNumber);
                    setEmail(data.email);
                    setUserId(data.id);
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await handleEditCustomer();
        setLoading(false);
    };


    //TODO: handle edit to DB
    const handleEditCustomer = async () => {
        // try {
        //     const customerRef = doc(db, 'customers', id);
        //     await updateDoc(customerRef, {
        //     });
        // } catch (error) {
        //     console.error("Error adding array:", error);
        // }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.label}>שם פרטי</label>
                    <input
                        type="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={styles.input}
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
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="id" className={styles.label}>תעודת זהות</label>
                    <input
                        type="number"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className={styles.input}
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
                        }}
                        className={styles.input}
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    {loading ? "עובדים על זה..." : "אישור"}
                </button>
            </form>
        </>
    )
};

export default EditCustomer;
