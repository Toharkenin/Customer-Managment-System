import { NavLink } from 'react-router';
import styles from './MainPage.module.scss';
function MainPage() {

    const clients = [
        {
            firstName: 'יוסי',
            lastName: 'כהן',
            phone: '050-1234567',
            email: 'yossi@example.com',
            healthStatement: 'עבר',
            clientStatement: 'מסכים',
            startDate: '01/01/2023',
            clientCard: '12345',
        },]

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
                    {clients.map((client, index) => (
                        <tr key={index}>
                            <td>{client.firstName}</td>
                            <td>{client.lastName}</td>
                            <td>{client.phone}</td>
                            <td>{client.email}</td>
                            <td>{client.healthStatement}</td>
                            <td>{client.clientStatement}</td>
                            <td>{client.startDate}</td>
                            <td>{client.clientCard}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainPage;
