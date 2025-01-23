import { useState, useEffect, useRef } from 'react';
import styles from './CustomerCard.module.scss';
import { useParams } from 'react-router';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import SignatureCanvas from 'react-signature-canvas'
import { format } from 'date-fns';

interface Card {
    date: string;
    customerSignature: string;
    providerSignature: string;
}

function CustomerCard() {

    const { id } = useParams();
    const [treatmentType, setTreatmentType] = useState<string>('');
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [cardData, setCardData] = useState<Card[]>([]);
    const [docExists, setDocExists] = useState<boolean>(false);
    const [newRow, setNewRow] = useState({
        date: "",
        customerSignature: "",
        providerSignature: "",
    });
    const [newDate, setNewDate] = useState<string>("");
    const [name, setName] = useState<string>('');
    const sigPadRefCustomer = useRef<SignatureCanvas>(null);
    const sigPadRefProvider = useRef<SignatureCanvas>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");




    // get customer's card
    useEffect(() => {
        if (id) {
            const customerRef = doc(db, 'customers', id);

            const unsubscribe = onSnapshot(customerRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const customerCards = data.cards || [];
                    const treatment = data.treatment || '';
                    const customerName = data.firstName + " " + data.lastName;
                    setName(customerName);

                    if (customerCards.length > 0) {
                        setCardData(customerCards);
                        setTreatmentType(treatment);
                        setDocExists(true);
                    }
                } else {
                    console.error('No such document!');
                    setDocExists(false);
                    setCardData([]);
                }
            });

            return () => unsubscribe();
        }
    }, [id]);

    const treatments = [
        "גב",
        "בטן",
        "כתפיים",
        "חזה",
        "עורף",
        "עצמות לחיים",
        "צאוור",
        "בין הגבות",
        "גבות",
        "אוזניים",
        "ידיים",
        "אף",
    ];


    const handleTreatmentSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTreatment(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const formatedDate = format(selectedDate, 'dd/MM/yyyy');
        console.log(typeof formatedDate);
        setNewDate(formatedDate);
        const { name, value } = e.target;
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: value,
        }));
    };


    const handleAddCardRow = async () => {
        if (newRow.date && !sigPadRefCustomer.current?.isEmpty() && !sigPadRefProvider.current?.isEmpty() && treatmentType !== "") {
            const customerSignatureData = sigPadRefCustomer.current?.toDataURL("image/png");
            const providerSignatureData = sigPadRefProvider.current?.toDataURL("image/png");


            const rowToAdd: Card = {
                date: newRow.date,
                customerSignature: customerSignatureData || "",
                providerSignature: providerSignatureData || "",
            };

            setCardData((prevData) => [...prevData, rowToAdd]);


            setNewRow({ date: "", customerSignature: "", providerSignature: "" });


            try {
                await addCardToDB(rowToAdd);
            } catch (error) {
                console.error("Error adding card to DB:", error);
            }
        } else {
            setErrorMessage("יש למלא את כל השדות");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000)
        }
    };


    const addCardToDB = async (data: Card) => {
        try {
            if (id) {
                const customerRef = doc(db, 'customers', id);
                await updateDoc(customerRef, {
                    cards: arrayUnion(data),
                });
                if (!docExists) {
                    await updateDoc(customerRef, {
                        treatment: selectedTreatment,
                    });
                }
                if (newDate !== "") {
                    console.log('d', newDate);
                    await updateDoc(customerRef, {
                        lastTreatment: newDate,
                    });
                }
            }
        } catch (error) {
            console.error("Error adding array:", error);
        }
    };
    const handleClearSign = (id: string) => {

        if (id === "customer" && sigPadRefCustomer.current) {
            sigPadRefCustomer.current.clear();
        } else if (id === "provider" && sigPadRefProvider.current)
            sigPadRefProvider.current.clear();
    };



    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.tableHeader}>כרטיס לקוח</h2>
            <h4>שם: {name}</h4>
            {!docExists ?
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
                <h3>סוג טיפול: {treatmentType}</h3>}


            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>תאריך</th>
                        <th>חתימת לקוח/ה</th>
                        <th>חתימת מטפל/ת</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="date"
                                name="date"
                                value={newRow.date}
                                onChange={handleInputChange}
                                className={styles.dateInputContainer}
                            />
                        </td>
                        <td>
                            <div className={styles.signatureBox}>
                                <SignatureCanvas penColor='black'
                                    canvasProps={{ width: 300, height: 150, className: 'sigCanvas' }}
                                    ref={sigPadRefCustomer}
                                />
                            </div>
                            <button
                                onClick={() => handleClearSign('customer')}
                                className={styles.clearButton}>מחיקה</button>
                        </td>
                        <td>
                            <div className={styles.signatureBox}>
                                <SignatureCanvas penColor='black'
                                    canvasProps={{ width: 300, height: 150, className: 'sigCanvas' }}
                                    ref={sigPadRefProvider}
                                />
                            </div>
                            <button
                                onClick={() => handleClearSign('provider')}
                                className={styles.clearButton}>מחיקה</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <button onClick={handleAddCardRow} className={styles.addButton}>
                {docExists ? 'הוספת שורה חדשה' : 'יצירת כרטיס'}
            </button>
            <br />
            {docExists ?
                <>
                    <h3 style={{ marginTop: '10rem' }}>היסטוריית תורים</h3>
                    <table className={styles.table} >
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
                                    <td className={styles.date}>{row.date}</td>
                                    <td>
                                        <img src={row.customerSignature} alt={'customer-signature'} />
                                    </td>
                                    <td>
                                        <img src={row.providerSignature} alt={'provider-signature'} />
                                    </td>
                                </tr>

                            ))}
                        </tbody>

                    </table>
                </> : null}

        </div >
    );
};


export default CustomerCard;



//1357 first bareakpoint 