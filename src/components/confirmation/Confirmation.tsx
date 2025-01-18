import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import SignatureCanvas from 'react-signature-canvas'
import { db } from "../../../firebase";
import styles from "./Confirmation.module.scss";
import { format } from "date-fns";

interface Props {
    customerEmail: string;
}

function Confirmation({ customerEmail }: Props) {

    const sigPadRef = useRef<SignatureCanvas>(null);
    const [date, setDate] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [authorazation, setAuthorazation] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClearSign = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
        }
    };

    const { id } = useParams();

    const handleSendForm = async () => {

        if (date === "" || sigPadRef.current?.isEmpty() || !authorazation) {
            setErrorMessage("אנא מלא/י את כל השדות הנדרשים לפני שליחה");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000)
            return
        }
        if (sigPadRef.current) {
            const signatureData = sigPadRef.current.toDataURL("image/png");
            if (id || customerEmail) {
                try {

                    setSuccessMessage("טופס נשלח בהצלחה");


                    const customerRef = doc(db, 'customers', id || customerEmail);
                    await updateDoc(customerRef, {
                        signature: signatureData,
                        startDate: date,
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);

                } catch (error) {
                    console.error("Error adding array:", error);
                }
            }
        }
    };
    return (
        <div className={styles.container}>
            <h3>הצהרה:</h3>
            <div className={styles.authorazation}>
                <input
                    type="checkbox"
                    name="authorazation"
                    onChange={() => setAuthorazation(true)}
                    required />
                <h5>אני מצהיר\ה בזה כי הפרטים שמסרתי לעיל הם נכונים</h5>
            </div>
            <div className="styles.date">
                <input
                    type='date'
                    className={styles.dateInputContainer}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const formatedDate = format(selectedDate, 'dd/MM/yyyy');
                        setDate(formatedDate);
                    }}
                    required={true}
                />

            </div>
            <div className={styles.signatureContainer}>
                <div style={{ border: '1px solid black', width: 500 }}>
                    <SignatureCanvas penColor='black'
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                        ref={sigPadRef}
                    />
                </div>
                <button
                    onClick={handleClearSign}
                    className={styles.clearButton}>מחיקה</button>
            </div>

            <button type='submit' className={styles.sendButton} onClick={handleSendForm}>
                שליחה
            </button>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
    )
}


export default Confirmation;