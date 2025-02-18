import { useState, useEffect, useRef } from 'react';
import styles from './CustomerCard.module.scss';
import { useParams } from 'react-router';
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import SignatureCanvas from 'react-signature-canvas'
import MultiplicationSignIcon from '../../assets/multiplication-sign-stroke-rounded';
import Delete01Icon from '../../assets/delete-01-stroke-rounded';
import Edit02Icon from '../../assets/edit-02-stroke-rounded';
import BookmarkCheck01Icon from '../../assets/bookmark-check-01-stroke-rounded';
import TagsIcon from '../../assets/tags-stroke-rounded';
import Comment01Icon from '../../assets/comment-01-stroke-rounded';

interface Card {
    date: Date | undefined;
    customerSignature: string;
    providerSignature: string;
}

interface Treatment {
    name: string;
    price: string;
    tempPrice?: string;
}

function CustomerCard() {

    const { id } = useParams();
    const [treatmentTypes, setTreatmentTypes] = useState<Treatment[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cardData, setCardData] = useState<Card[]>([]);
    const [docExists, setDocExists] = useState<boolean>(false);
    const [newRow, setNewRow] = useState({
        date: undefined as Date | undefined,
        customerSignature: "",
        providerSignature: "",
    });
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const sigPadRefCustomer = useRef<SignatureCanvas>(null);
    const sigPadRefProvider = useRef<SignatureCanvas>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
    const [editedDates, setEditedDates] = useState<{ [key: number]: Date | undefined }>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showPriceInput, setShowPriceInput] = useState<{ [key: number]: boolean }>({});
    const [note, setNote] = useState<string>("");
    const [tempNote, setTempNote] = useState<string>("");
    const [isEditNoteOpen, setIsEditNoteOpen] = useState<boolean>(false);



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
                    const noteFromData = data.note || "";
                    setName(customerName);
                    setPhoneNumber(customerPhoneNumber);
                    setTreatmentTypes(treatments);
                    setNote(noteFromData);
                    if (customerCards.length > 0) {
                        setCardData(customerCards);
                        setDocExists(true);
                    }
                    else {
                        setDocExists(false);
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



    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);



    const treatments: Treatment[] = [
        { name: "גב", price: "" },
        { name: "בטן", price: "" },
        { name: "כתפיים", price: "" },
        { name: "חזה", price: "" },
        { name: "עורף", price: "" },
        { name: "עצמות לחיים", price: "" },
        { name: "צאוור", price: "" },
        { name: "בין הגבות", price: "" },
        { name: "גבות", price: "" },
        { name: "אוזניים", price: "" },
        { name: "ידיים", price: "" },
        { name: "אף", price: "" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        setNewRow((prevRow) => ({
            ...prevRow,
            date: selectedDate,
        }));
    };

    const handlePriceTagsIconClick = (index: number) => {
        setShowPriceInput((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));

    }


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


            setNewRow({ date: undefined, customerSignature: "", providerSignature: "" });
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

    const handleOptionClick = async (option: Treatment) => {
        setTreatmentTypes((prev) => {
            const existingTreatment = prev.find(item => item.name === option.name);
            if (existingTreatment) {
                return prev.filter((item) => item.name !== option.name);
            } else {
                return [...prev, option];
            }
        });
        try {
            if (id) {
                const customerRef = doc(db, 'customers', id);
                const treatmentNames = treatmentTypes.map(t => t.name);

                if (treatmentNames.includes(option.name)) {
                    await updateDoc(customerRef, {
                        treatments: arrayRemove(option),
                    });
                } else {
                    await updateDoc(customerRef, {
                        treatments: arrayUnion(option),
                    });
                }

                setIsDropdownOpen(false);
            }
        } catch (error) {
            console.error("Error adding treatment:", error);
        }
    };


    const handlePriceInput = (e: React.FormEvent<HTMLSpanElement>, i: number) => {
        const updatedTreatmentTypes = treatmentTypes.map((treatment, index) =>
            index === i ? { ...treatment, tempPrice: e.currentTarget.innerText } : treatment
        );

        setTreatmentTypes(updatedTreatmentTypes);
    };


    const removeTreatment = async (treatmentToRemove: Treatment) => {
        try {
            setTreatmentTypes((prev) => prev.filter((item) => item.name !== treatmentToRemove.name));

            if (id) {
                const customerRef = doc(db, 'customers', id);

                await updateDoc(customerRef, {
                    treatments: arrayRemove(treatmentToRemove),
                });
            }
        } catch (error) {
            console.error("Error removing treatment:", error);
        }
    };

    const handleNoteInput = (e: React.FormEvent<HTMLSpanElement>) => {
        setTempNote(e.currentTarget.innerText);
    };

    const handleNoteBlur = () => {
        const trimmedNote = tempNote.trim();
        setNote(trimmedNote);

        if (id) {
            const customerRef = doc(db, 'customers', id);
            updateDoc(customerRef, { note: trimmedNote })
                .then(() => console.log("Note updated successfully"))
                .catch((error) => console.error("Error updating note:", error));
        }
    };


    const addCardToDB = async (data: Card) => {
        try {
            if (id) {
                const customerRef = doc(db, 'customers', id);
                const docSnap = await getDoc(customerRef);
                const today = new Date();
                if (docSnap.exists()) {
                    const customerData = docSnap.data();
                    const existingCards = customerData.cards || [];

                    const updatedCards = [...existingCards, data];
                    let latestDate: Date | null = null;

                    for (const card of updatedCards) {
                        let date = card.date;
                        if (date instanceof Timestamp) {
                            date = card.date.toDate() as Date
                        };

                        if (date <= today) {
                            console.log("G", date);
                            if (latestDate === null || date > latestDate) {

                                latestDate = date;
                                console.log("date", latestDate);
                            }

                        }
                    }

                    await updateDoc(customerRef, {
                        cards: arrayUnion(data),
                        lastTreatment: latestDate,
                    });
                }
            }
        } catch (error) {
            console.error("Error adding card to DB:", error);
        }
    };



    const handleClearSign = (id: string) => {

        if (id === "customer" && sigPadRefCustomer.current) {
            sigPadRefCustomer.current.clear();
        } else if (id === "provider" && sigPadRefProvider.current)
            sigPadRefProvider.current.clear();
    };


    const handleDeleteCard = async (index: number) => {
        if (!id) return;

        const customerRef = doc(db, "customers", id);
        let latestDate: Date | null = null;

        try {
            const docSnap = await getDoc(customerRef);
            if (docSnap.exists()) {
                let updatedCards = docSnap.data().cards.filter((_: any, i: number) => i !== index);
                const today = new Date();
                if (updatedCards.length > 0) {
                    for (const card of updatedCards) {
                        let date = card.date;
                        if (date instanceof Timestamp) {
                            date = card.date.toDate() as Date
                        };
                        if (date <= today) {
                            if (latestDate === null || date > latestDate) {
                                latestDate = date;
                            }

                        }
                    }
                }
                await updateDoc(customerRef, {
                    cards: updatedCards,
                    lastTreatment: latestDate
                });

                setCardData(updatedCards);
            }
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };




    const handleDateChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        setEditedDates(prev => ({
            ...prev,
            [index]: selectedDate,
        }));
    };


    const handleEditCard = async (index: number) => {
        const newDate = editedDates[index];
        if (!newDate || !id) return;

        const customerRef = doc(db, "customers", id);

        try {
            const docSnap = await getDoc(customerRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                let updatedCards = data.cards.map((card: any, i: number) =>
                    i === index ? { ...card, date: Timestamp.fromDate(new Date(newDate)) } : card
                );
                let latestDate: Date | null = null;

                for (const card of updatedCards) {
                    let date = card.date;
                    if (date instanceof Timestamp) {
                        date = card.date.toDate() as Date
                    };
                    if (date <= new Date()) {
                        if (latestDate === null || date > latestDate) {
                            latestDate = date;
                        }

                    }
                }

                setEditedDates((prev) => {
                    const newState = { ...prev };
                    delete newState[index];
                    return newState;
                });

                await updateDoc(customerRef, {
                    cards: updatedCards,
                    lastTreatment: latestDate
                });


            }
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };



    return (
        <div className={styles.tableContainer} >
            <h2 className={styles.tableHeader}>כרטיס לקוח</h2>
            <h4>שם: {name}</h4>
            <h4>מספר טלפון: {phoneNumber}</h4>


            <div className={styles.chooseTreatment}
                onClick={toggleDropdown}>
                בחירת טיפול
            </div>
            {isDropdownOpen && (
                <div className={styles.dropDown} ref={dropdownRef}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {treatments.map((option) => (
                            <li
                                key={option.name}
                                className={`${styles.itemList} ${treatmentTypes.find(t => t.name === option.name) ? styles.selected : ""}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.name}
                            </li>
                        ))}
                    </ul>
                </div>)}
            <div className={styles.customerTreatments}>
                {treatmentTypes.map((treatment, i) => (
                    <div key={treatment.name} className={styles.treatmentsListContainer}>
                        <div className={styles.CustomerTreatments}>
                            <div>{treatment.name}</div>
                            <MultiplicationSignIcon
                                className={styles.removeIcon}
                                onClick={() => removeTreatment(treatment)}
                            />
                            <TagsIcon
                                className={styles.priceTagIcon}
                                style={{ color: treatment.price && treatment.price.length > 0 ? "black" : "gray" }}
                                onClick={() => handlePriceTagsIconClick(i)} />
                            {showPriceInput[i] && <div className={styles.priceContainer}><span
                                className={styles.priceSpan}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={() => {
                                    const updatedTreatmentTypes = treatmentTypes.map(t =>
                                        t.name === treatment.name ? { ...t, price: t.tempPrice?.trim() || t.price, tempPrice: "" } : t
                                    );
                                    setTreatmentTypes(updatedTreatmentTypes);
                                    console.log(updatedTreatmentTypes)
                                    if (id) {
                                        const customerRef = doc(db, 'customers', id);
                                        updateDoc(customerRef, {
                                            treatments: updatedTreatmentTypes
                                        });
                                    }
                                }}
                                style={{ cursor: "text", outline: "none", textAlign: "right" }}
                                onInput={(e) => handlePriceInput(e, i)}
                            >
                                {treatment.price}
                            </span>
                                {treatment.price && treatment.price.length > 0 ? <h5>&nbsp;{` ש''ח `}</h5> : null}
                            </div>
                            }
                        </div>
                    </div>
                ))}
            </div>

            <div >
                {
                    note === "" ?
                        <div className={styles.noteContainer} onClick={() => setIsEditNoteOpen((prev) => !prev)}>
                            <Comment01Icon className={styles.noteIcon} />
                            <h4 className={styles.addNoteText}>הוספת הערה</h4>
                        </div>
                        : null}
                <>{isEditNoteOpen || note !== "" ?
                    <div className={styles.noteSpanContainer}>
                        {<h4 className={styles.notesText}>הערות ללקוח:&nbsp;</h4>}
                        <span
                            className={styles.noteSpan}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={handleNoteBlur}
                            onInput={(e) => handleNoteInput(e)}
                            style={{ cursor: "text", outline: "none", textAlign: "right" }}
                        >
                            {note}
                        </span>
                    </div>
                    : null
                }</>


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
                                value={newRow.date ? newRow.date.toISOString().split('T')[0] : ''}
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
                                    <td className={styles.date}>
                                        {isEditing[index] ?
                                            <input
                                                type="date"
                                                name="date"
                                                value={editedDates[index] ? editedDates[index].toISOString().split("T")[0] : ""}
                                                onChange={(e) => handleDateChange(index, e)}
                                                className={styles.dateInputContainer}
                                            /> :
                                            <h3>
                                                {row.date
                                                    ? (row.date instanceof Timestamp
                                                        ? row.date.toDate().toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })
                                                        : row.date instanceof Date
                                                            ? row.date.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })
                                                            : 'תאריך לא תקין')
                                                    : 'לא נבחר תאריך'}
                                            </h3>}
                                    </td>
                                    <td>
                                        <img src={row.customerSignature} alt={'customer-signature'} />
                                    </td>
                                    <td>
                                        <img src={row.providerSignature} alt={'provider-signature'} />
                                    </td>
                                    <td>
                                        <Delete01Icon
                                            style={isEditing[index] ? { cursor: 'auto' } : { cursor: 'pointer' }}
                                            onClick={() => isEditing[index] ? null : handleDeleteCard(index)}
                                            color={isEditing[index] ? 'grey' : '#ff0000'}
                                            className={styles.editdelete} />
                                    </td>
                                    <td>
                                        {isEditing[index] ?
                                            <BookmarkCheck01Icon
                                                className={styles.okButton}
                                                onClick={() => handleEditCard(index)} />
                                            :
                                            <Edit02Icon
                                                style={{ cursor: 'pointer' }}
                                                color={'green'}
                                                className={styles.editdelete}
                                                onClick={() => {
                                                    setIsEditing((prev) => ({ ...prev, [index]: true }))
                                                    setEditedDates((prev) => ({ ...prev, index: row.date }))
                                                }}
                                            />}
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

