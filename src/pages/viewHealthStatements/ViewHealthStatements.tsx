import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from './ViewHealthStatements.module.scss';
import { useParams } from 'react-router';

interface Answer {
    questionId: number;
    checkbox: string;
    answer: string;
}

interface Question {
    id: number;
    text: string;
}

const questions: Question[] = [
    { id: 1, text: 'האם הנך נוטל/ת תרופות באופן קבוע ?' },
    { id: 2, text: 'האם יש לך מגבלות פיסיות ?' },
    { id: 3, text: 'האם הנך מקבל/ת טיפול רפואי בהווה ?  (מערבי / משלים / אחר) ?' },
    { id: 4, text: 'האם הנך סובל/ת, או סבלת בשנתיים האחרונות מבעיות גב ?' },
    { id: 5, text: 'האם הנך מעשן/ת  (פרט/י כמויות) ?' },
    { id: 6, text: 'האם היו לך תאונות כתוצאה מפעילות ספורטיבית/אחרת ?' },
    { id: 7, text: 'בעיות גב:' },
    { id: 8, text: ':התכווצויות שרירים' },
    { id: 9, text: ':בעיות אוזניים/שמיעה' },
    { id: 10, text: 'מחלות עיניים/ראייה' },
    { id: 11, text: 'הפרעות עיכול' },
    { id: 12, text: 'כאבי ראש / מיגרנות' },
    { id: 13, text: 'סכרת' },
    { id: 14, text: 'קצרת (אסטמה)' },
    { id: 15, text: 'דלקת ריאות' },
    { id: 16, text: 'מחלות לב וכלי דם' },
    { id: 17, text: 'לחץ דם גבוה ' },
    { id: 18, text: 'דיכאון / חרדות' },
    { id: 19, text: 'משקפיים/עדשות מגע' },
    { id: 20, text: 'מחלות פרקים' },
    { id: 21, text: 'דלקת לימפה' },
    { id: 22, text: 'איידס' },
    { id: 23, text: 'שיתוק' },
    { id: 24, text: 'בעיות סינוסים' },
    { id: 25, text: 'סרטן' },
    { id: 26, text: 'בעיות שינה' },
    { id: 27, text: 'בעיות בבטן' },
    { id: 28, text: 'מחלות כליות' },
    { id: 29, text: 'מחלות עור' },
    { id: 30, text: 'התעלפויות' },
    { id: 31, text: 'כאב כרוני' },
];

function ViewHealthStatements() {
    const [answers, setAnswers] = useState<Answer[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState<string>("");
    const [customerSignature, setCostumerSignature] = useState<string>("");
    const [customerDate, setCustomerDate] = useState<string>("");


    const { id } = useParams();
    useEffect(() => {
        const fetchAnswers = async () => {
            if (id) {
                try {
                    const customerRef = doc(db, 'customers', id);
                    const docSnap = await getDoc(customerRef);

                    if (docSnap.exists()) {

                        const data = docSnap.data();
                        const name = data.firstName + ' ' + data.lastName;
                        const signature = data.signature;
                        const date = data.startDate;
                        setAnswers(data.HealthStatement || []);
                        setCostumerSignature(signature);
                        setCustomerDate(date);
                        setCustomerName(name);
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching health statement:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAnswers();
    }, [id]);

    console.log(customerSignature)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!answers || answers.length === 0) {
        return <div>No health statement found for this customer.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>הצהרת בריאות</h2>
            <h3 className={styles.header}>{customerName}</h3>
            <div className={styles.questions}>
                {questions.map((question) => {
                    const answer = answers.find((a) => a.questionId === question.id);
                    return (
                        <div key={question.id} className={styles.questionContainer}>
                            <p className={styles.question}>{question.text}</p>
                            {answer ? (
                                <div className={styles.answerContainer}>
                                    <p className={styles.answer}><strong> {answer.checkbox === 'yes' ? 'כן' : 'לא'}</strong></p>
                                    {answer.checkbox === 'yes' && answer.answer && (
                                        <p className={styles.details}><strong>פירוט:</strong> {answer.answer}</p>
                                    )}
                                </div>
                            ) : (
                                <p className={styles.answer}><strong>תשובה:</strong> אין תשובה</p>
                            )}

                        </div>
                    );
                })}
            </div>
            <div className={styles.sugnatureContainer}>
                <img src={customerSignature} alt="customer-signature" className={styles.sugnature} />
            </div>
            <h3 className={styles.date}>{customerDate}</h3>
        </div>
    );
}

export default ViewHealthStatements;
