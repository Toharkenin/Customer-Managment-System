import { NavLink } from 'react-router';
import styles from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import Edit02Icon from '../../assets/edit-02-stroke-rounded';
import Delete01Icon from '../../assets/delete-01-stroke-rounded';


interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    healthStatement: boolean;
    clientStatement: boolean;
    startDate: string;
    clientCard: string;
}

function MainPage() {

    const usersCollectionRef = collection(db, 'customers');
    const [loading, setLoading] = useState<boolean>(false);
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('firstName');

    useEffect(() => {
        const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
            const customers: Customer[] = [];
            let healthStatementFound = false;
            let statementsFound = false;

            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();

                if (Array.isArray(data.HealthStatement)) {
                    healthStatementFound = true;
                }

                if (data.statement !== undefined) {
                    statementsFound = true;
                }

                customers.push({
                    id: doc.id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phone: data.phoneNumber || '',
                    email: data.email || '',
                    healthStatement: healthStatementFound,
                    clientStatement: statementsFound,
                    startDate: data.startDate || '',
                    clientCard: '12345',
                });
            });

            setAllCustomers(customers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);




    useEffect(() => {
        let filteredList = allCustomers;
        let sortedList = allCustomers;
        console.log(filterBy)

        if (filterBy === 'firstName') {

            filteredList = allCustomers.filter((customer) =>
                customer.firstName.toLowerCase().includes(search.toLowerCase())
            );
            sortedList = filteredList.sort((a, b) => a.firstName.localeCompare(b.firstName));
        }
        if (filterBy === 'lastName') {
            filteredList = allCustomers.filter((customer) =>
                customer.lastName.toLowerCase().includes(search.toLowerCase())
            );
            sortedList = filteredList.sort((a, b) => a.lastName.localeCompare(b.firstName));
        }

        setFilteredCustomers(sortedList);
    }, [allCustomers, search, filterBy]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);
        const filteredList = allCustomers.filter((customer) =>
            customer.firstName.toLowerCase().includes(searchTerm) ||
            customer.lastName.toLowerCase().includes(searchTerm)
        );

        setFilteredCustomers(filteredList);
    };

    const healthStatement = (health: boolean) => {
        if (health) {
            return <button className={styles.healthButton}>הצהרת בריאות</button>
        } else {
            return (
                <button className={styles.addHealthButton}>+ חדש</button>
            )
        }
    };

    const statements = (statementsExist: boolean) => {
        if (statementsExist) {
            return <button className={styles.healthButton}>הצהרת הלקוח</button>
        } else {
            return (
                <button className={styles.addHealthButton}>+ חדש</button>
            )
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerSection}>
                <h2>לקוחות</h2>
                <div className={styles.buutons}>
                    <NavLink to="/Form">
                        <button className={styles.newClientButton}>+ לקוח חדש</button>
                    </NavLink>
                    <NavLink to="/">
                        <button className={styles.newClientButton}>+ כרטיס לקוח </button>
                    </NavLink>
                </div>
            </div>
            <div className={styles.searchBoxContainer}>
                <input
                    type="text"
                    placeholder="חיפוש..."
                    className={styles.searchBox}
                    value={search}
                    onChange={handleSearch}
                />
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className={styles.filterSelector}
                >
                    <option value="firstName">סינון לפי שם פרטי</option>
                    <option value="lastName">סינון לפי שם משפחה</option>
                </select>
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
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length === 0 ? (
                        <tr>
                            <td >No customers found</td>
                        </tr>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.firstName}</td>
                                <td>{customer.lastName}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.email}</td>
                                <td>
                                    {healthStatement(customer.healthStatement)}
                                </td>
                                <td>{statements(customer.clientStatement)}</td>
                                <td>{customer.startDate}</td>
                                <td>{customer.clientCard}</td>
                                <td>
                                    <Edit02Icon
                                        style={{ cursor: 'pointer' }}
                                        // onClick={() => }
                                        color={'blue'}
                                    />
                                    <Delete01Icon
                                        style={{ cursor: 'pointer' }}
                                        // onClick={() => }
                                        color={'#ff0000'} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MainPage;
