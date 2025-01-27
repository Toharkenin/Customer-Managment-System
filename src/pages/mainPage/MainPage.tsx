import { NavLink, useNavigate } from 'react-router';
import styles from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import Edit02Icon from '../../assets/edit-02-stroke-rounded';
import Delete01Icon from '../../assets/delete-01-stroke-rounded';
import Search01Icon from '../../assets/search-01-stroke-rounded';
import DeleteAlert from '../../components/deleteAlert/DeleteAlert';
import logoDark from '../../assets/logo-dark.png';
import Logout01Icon from '../../assets/logout-01-stroke-rounded';
import { useAuth } from "../../routes/AuthContext";


interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    healthStatement: boolean;
    clientStatement: boolean;
    lastTreatment: string;
    clientCard: boolean;
}

function MainPage() {


    const usersCollectionRef = collection(db, 'customers');
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('firstName');
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    const [currentCustomerId, setCurrentCustomerId] = useState<string>('');
    const navigation = useNavigate();
    const { logout } = useAuth();


    useEffect(() => {
        const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
            const customers: Customer[] = [];

            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();

                customers.push({
                    id: doc.id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phone: data.phoneNumber || '',
                    email: data.email || '',
                    healthStatement: !!data.HealthStatement,
                    clientStatement: !!data.statements,
                    lastTreatment: data.lastTreatment || '',
                    clientCard: !!data.cards,
                });
            });

            setAllCustomers(customers);


        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let filteredList = allCustomers;
        let sortedList = allCustomers;

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

    const healthStatement = (health: boolean, id: string) => {
        if (health) {
            return (
                <NavLink to={`/Health-statements-view/${id}`}>
                    <button className={styles.healthButton}>הצהרת בריאות</button>
                </NavLink>
            )
        } else {
            return (
                <NavLink to={`/Health-Statement/${id}`}>
                    <button className={styles.addHealthButton}>הוספת הצהרה</button>
                </NavLink>
            )
        }
    };

    const statements = (statementsExist: boolean, id: string) => {
        if (statementsExist) {

            return <NavLink to={`/Statements-Page/${id}`}>
                <button className={styles.healthButton}>הצהרת הלקוח</button>
            </NavLink>
        } else {
            return (
                <NavLink to={`/Statements-Page/${id}`}>
                    <button className={styles.addHealthButton}>הוספת הצהרה</button>
                </NavLink>
            )
        }
    };

    const customerCard = (customerCardExist: boolean) => {
        if (customerCardExist) {
            return <button className={styles.healthButton}>כרטיס לקוח</button>
        } else {
            return (
                <button className={styles.addCardButton}>הוסף כרטיס</button>
            )
        }
    };

    const handleDeleteCustomer = async (ustomerId: string) => {
        try {
            await deleteDoc(doc(db, "customers", ustomerId));

            setAllCustomers((prev) => prev.filter((customer) => customer.id !== ustomerId));

        } catch (error) {
            console.error("Error deleting customer:", error);
        } finally {
            setDeleteAlert(false);
        }
    };

    const handleLogout = async () => {
        logout();
        navigation('/login');
    };

    return (
        <div className={styles.tableContainer}>
            {deleteAlert ?
                <DeleteAlert
                    message='אתה בטוח שאתה רוצה למחוק לקוח ?'
                    onConfirm={() => handleDeleteCustomer(currentCustomerId)}
                    onCancel={() => setDeleteAlert(false)}
                /> : null}

            <div className={styles.headerSection}>
                <div className={styles.buutons}>
                    <img src={logoDark} alt="Logo" className={styles.logo} />
                    <h2 style={{ color: "#000" }}>יומן לקוחות</h2>
                </div>
                <div className={styles.buutons}>
                    <NavLink to="/Form">
                        <button className={styles.newClientButton}>+ לקוח חדש</button>
                    </NavLink>
                    <Logout01Icon className={styles.logoutIcon} onClick={handleLogout} />
                </div>
            </div>
            <div className={styles.searchBoxContainer}>
                <input
                    type="text"
                    placeholder="חיפוש..."
                    className={styles.searchBox}
                    value={search}
                    onChange={handleSearch}
                /><Search01Icon className={styles.searchIcon} />
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
                        <th>טיפול אחרון</th>
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
                                    {healthStatement(customer.healthStatement, customer.id)}
                                </td>
                                <td>{statements(customer.clientStatement, customer.id)}</td>
                                <td>{customer.lastTreatment}</td>
                                <td>
                                    <NavLink to={`/Customer-Card/${customer.id}`}>
                                        {customerCard(customer.clientCard)}
                                    </NavLink>
                                </td>
                                <td>
                                    <NavLink to={`/Edit-Customer/${customer.id}`}>
                                        <Edit02Icon
                                            style={{ cursor: 'pointer' }}
                                            color={'green'}
                                            className={styles.editdelete}
                                        />
                                    </NavLink>

                                    <Delete01Icon
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setDeleteAlert(true);
                                            setCurrentCustomerId(customer.id);
                                        }}
                                        color={'#ff0000'}
                                        className={styles.editdelete} />
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
