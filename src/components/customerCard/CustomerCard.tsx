import { useState, useEffect, useRef } from 'react';
import styles from './CustomerCard.module.scss';
import { useParams } from 'react-router';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import SignatureCanvas from 'react-signature-canvas'
import { format } from 'date-fns';
import MultiplicationSignIcon from '../../assets/multiplication-sign-stroke-rounded';
import Delete01Icon from '../../assets/delete-01-stroke-rounded';
import Edit02Icon from '../../assets/edit-02-stroke-rounded';

interface Card {
    date: string;
    customerSignature: string;
    providerSignature: string;
}

function CustomerCard() {

    const { id } = useParams();
    const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cardData, setCardData] = useState<Card[]>([]);
    const [docExists, setDocExists] = useState<boolean>(false);
    const [newRow, setNewRow] = useState({
        date: "",
        customerSignature: "",
        providerSignature: "",
    });
    const [newDate, setNewDate] = useState<string>("");
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
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
                    const treatments = data.treatments || [];
                    const customerName = data.firstName + " " + data.lastName;
                    const customerPhoneNumber = data.phoneNumber;
                    setName(customerName);
                    setPhoneNumber(customerPhoneNumber);
                    if (customerCards.length > 0) {
                        setCardData(customerCards);
                        setTreatmentTypes(treatments);
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
        if (newRow.date && !sigPadRefCustomer.current?.isEmpty() && !sigPadRefProvider.current?.isEmpty()
            && treatmentTypes.length > 0) {
            const customerSignatureData = sigPadRefCustomer.current?.toDataURL("image/png");
            const providerSignatureData = sigPadRefProvider.current?.toDataURL("image/png");


            const rowToAdd: Card = {
                date: newRow.date,
                customerSignature: customerSignatureData || "",
                providerSignature: providerSignatureData || "",
            };

            setCardData((prevData) => [...prevData, rowToAdd]);


            setNewRow({ date: "", customerSignature: "", providerSignature: "" });
            sigPadRefCustomer.current?.clear();
            sigPadRefProvider.current?.clear();

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

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = async (option: string) => {
        setTreatmentTypes((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
        try {

            if (id) {
                const customerRef = doc(db, 'customers', id);

                await updateDoc(customerRef, {
                    treatments: arrayUnion(option),
                });
            }
        } catch (error) {
            console.error("Error adding treatment:", error);
        }
    };


    const removeTreatment = async (treatment: string) => {
        try {
            setTreatmentTypes((prev) => prev.filter((item) => item !== treatment));

            if (id) {
                const customerRef = doc(db, 'customers', id);

                await updateDoc(customerRef, {
                    treatments: arrayUnion(treatment),
                });
            }
        } catch (error) {
            console.error("Error removing treatment:", error);
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
                        treatments: treatmentTypes,
                    });
                }
                if (newDate !== "") {
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
            <h4>מספר טלפון: {phoneNumber}</h4>


            <div className={styles.chooseTreatment}
                onClick={toggleDropdown}>
                בחירת טיפול
            </div>
            {isDropdownOpen && (
                <div className={styles.dropDown}>
                    <ul
                        style={{ listStyle: "none", padding: 0, margin: 0 }}
                    >
                        {treatments.map((option) => (
                            <li
                                key={option}
                                className={`${styles.itemList} ${treatmentTypes.includes(option) ? styles.selected : ""
                                    }`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>)}
            <div className={styles.customerTreatments}>
                {treatmentTypes.map((treatment) => (
                    <div key={treatment} className={styles.treatmentsListContainer}>
                        <div className={styles.CustomerTreatments}>
                            <div>{treatment}</div>
                            <MultiplicationSignIcon
                                className={styles.removeIcon}
                                onClick={() => removeTreatment(treatment)}
                            />

                        </div>
                    </div>
                ))}
            </div>

            <table className={`${styles.table} ${styles.topTable}`}>
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
                            <h4 className={styles.dateHeader}>תאריך</h4>
                            <input
                                type="date"
                                name="date"
                                value={newRow.date}
                                onChange={handleInputChange}
                                className={styles.dateInputContainer}
                            />
                        </td>
                        <td>
                            <h4 className={styles.dateHeader}>חתימת לקוח</h4>
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
                            <h4 className={styles.dateHeader}>חתימת מטפל</h4>
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
                    <table className={`${styles.table} ${styles.bottomTable}`} >
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>חתימת לקוח/ה</th>
                                <th>חתימת מטפל/ת</th>
                                <th colSpan={2}>פעולות</th>
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
                                    <td>
                                        <Delete01Icon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {

                                            }}
                                            color={'#ff0000'}
                                            className={styles.editdelete} />
                                    </td>
                                    <td>
                                        <Edit02Icon
                                            style={{ cursor: 'pointer' }}
                                            color={'green'}
                                            className={styles.editdelete}
                                        />
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

