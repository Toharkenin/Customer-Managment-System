import { useState, useRef } from 'react';
import styles from './CustomerCard.module.scss';

interface Props {
    customerEmail?: React.Dispatch<React.SetStateAction<string>>;
}
function CustomerCard({ customerEmail }: Props) {

    const rows = [
        { date: '2025-01-01', clientSignature: 'חתימת לקוח', providerSignature: 'חתימת מטפל/ת' },
        { date: '2025-01-02', clientSignature: 'חתימת לקוח', providerSignature: 'חתימת מטפל/ת' },
        { date: '2025-01-03', clientSignature: 'חתימת לקוח', providerSignature: 'חתימת מטפל/ת' },
    ];

    customerEmail = 'ddd'

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.tableHeader}>טבלת חתימות</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>חתימת לקוח/ה</th>
                        <th>חתימת מטפל/ת</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>
                                <div className={styles.signatureBox}>{row.clientSignature}</div>
                            </td>
                            <td>
                                <div className={styles.signatureBox}>{row.providerSignature}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default CustomerCard;