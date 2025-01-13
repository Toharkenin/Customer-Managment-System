import { NavLink } from 'react-router';
import styles from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';


interface Customer {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    healthStatement: string;
    clientStatement: string;
    startDate: string;
    clientCard: string;
}

function MainPage() {


    const usersCollectionRef = collection(db, 'customers');
    const [loading, setLoading] = useState<boolean>(false);
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
            const customers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                phone: doc.data().phoneNumber,
                email: doc.data().email,
                healthStatement: 'עבר',
                clientStatement: 'מסכים',
                startDate: doc.data().startDate,
                clientCard: '12345',
            }));

            setAllCustomers(customers);
            setLoading(false);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, []);


    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerSection}>
                <h2>לקוחות</h2>
                <NavLink to="/Form">
                    <button className={styles.newClientButton}>+ לקוח חדש</button>
                </NavLink>
            </div>
            <table className={styles.clientTable}>
                <thead>
                    <tr>
                        <th>שם פרטי</th>
                        <th>שם משפחה</th>
                        <th>טלפון</th>
                        <th>אימייל</th>
                        <th>הצהרת בריאות</th>
                        <th>הצהרת הלקוח</th>
                        <th>תאריך התחלה</th>
                        <th>כרטיס לקוח</th>
                    </tr>
                </thead>
                <tbody>
                    {allCustomers.length === 0 ? (
                        <tr>
                            <td >No customers found</td>
                        </tr>
                    ) : (
                        allCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.firstName}</td>
                                <td>{customer.lastName}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.email}</td>
                                <td>{customer.healthStatement}</td>
                                <td>{customer.clientStatement}</td>
                                {/* <td>{Format(new Date(client.startDate), 'dd/MM/yyyy')}</td> */}
                                <td>{customer.clientCard}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MainPage;
