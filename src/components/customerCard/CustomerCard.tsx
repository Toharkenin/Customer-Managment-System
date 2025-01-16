import { useState, useEffect } from 'react';
import styles from './CustomerCard.module.scss';
import { useParams } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Props {
    customerEmail: string;
}

interface Card {
    date: string;
    customerSignature: string;
    providerSignature: string;
}

function CustomerCard({ customerEmail }: Props) {

    const { id } = useParams();
    const [isCardNew, setIsCardNew] = useState<boolean>(true);
    const [treatmentType, setTreatmentType] = useState<string>('');
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [cardData, setCardData] = useState<Card[]>([]);
    const [newRow, setNewRow] = useState({
        date: "",
        customerSignature: "",
        providerSignature: "",
    });




    // get customer's card
    useEffect(() => {

        const cardArray: Card[] = [];

        if (id || customerEmail) {
            const getCard = async () => {

                try {
                    const customerRef = doc(db, 'customers', id || customerEmail);
                    const customerSnap = await getDoc(customerRef);

                    if (customerSnap.exists()) {
                        const data = customerSnap.data();

                        const customerCards = data.card || [];
                        const treatment = data.treatment || '';


                        if (Array.isArray(customerCards)) {
                            customerCards.forEach((card: Card) => {
                                cardArray.push(card);
                                setCardData(cardArray);
                                setTreatmentType(treatment);
                            });
                        } else {
                            setIsCardNew(true);
                        }
                    } else {
                        console.error('No such document!');
                    }
                } catch (err) { }
            };
            getCard();
        }

    }, []);

    const treatments = [
        "Hair Removal",
        "Facial Treatment",
        "Body Contouring",
        "Laser Therapy",
        "Massage Therapy",
        // Add more treatments here...
    ];


    const handleTreatmentSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTreatment(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: value,
        }));
    };

    const handleAddRow = () => {
        if (newRow.date && newRow.customerSignature && newRow.providerSignature) {
            setCardData((prevData) => [...prevData, newRow]);
            setNewRow({ date: "", customerSignature: "", providerSignature: "" });
        } else {
            alert("Please fill out all fields!");
        }
    };

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.tableHeader}>כרטיס לקוח</h2>
            {isCardNew ?
                <select
                    id="treatmentSelector"
                    value={selectedTreatment}
                    onChange={handleTreatmentSelection}
                    className={styles.chooseTreatment}
                >
                    <option value="" disabled>
                        בחר\י סוג טיפול
                    </option>
                    {treatments.map((treatment, index) => (
                        <option key={index} value={treatment}>
                            {treatment}
                        </option>
                    ))}
                </select> :
                <h3>`סוג טיפול: {treatmentType}`</h3>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>חתימת לקוח/ה</th>
                        <th>חתימת מטפל/ת</th>
                    </tr>
                </thead>
                <tbody>
                    {cardData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>
                                <div className={styles.signatureBox}>{row.customerSignature}</div>
                            </td>
                            <td>
                                <div className={styles.signatureBox}>{row.providerSignature}</div>
                            </td>
                        </tr>

                    ))}
                    <tr>
                        <td>
                            <input
                                type="date"
                                name="date"
                                value={newRow.date}
                                onChange={handleInputChange}
                                className={styles.inputField}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="customerSignature"
                                value={newRow.customerSignature}
                                onChange={handleInputChange}
                                placeholder="Enter customer signature"
                                className={styles.inputField}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="providerSignature"
                                value={newRow.providerSignature}
                                onChange={handleInputChange}
                                placeholder="Enter provider signature"
                                className={styles.inputField}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleAddRow} className={styles.addButton}>
                הוסף שורה חדשה
            </button>
        </div>
    );
};


export default CustomerCard;