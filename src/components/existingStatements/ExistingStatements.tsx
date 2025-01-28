import { useEffect, useState } from 'react';
import styles from './ExistingStatements.module.scss';
import { useParams } from 'react-router';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Tick01Icon from '../../assets/V-icon';

function ExistingStatements() {

    const firstConsentTexts = [
        "טיפול הסרת שיער המתבצע באמצעות טכנולוגיית לייזר המאפשרת חימום הדרגתי של זקיק השערה והרקמה לאורך זמן ותוך כדי תנועה.",
        "התוצאות הקליניות של הטיפול עשויות להשתנות מאדם לאדם בהתאם לתכונותיו הפיזיולוגיות, גילו ומינו ובהתאם למצב המטופל.",
        "מסיבות אלו לא ניתן לחזות במדויק את מספר הטיפולים הנדרשים להשגת תוצאה אופטימאלית ולכן מספר הטיפולים הנדרשים שונה בין אדם לאדם.",
        "במקרים נדירים, ייתכן שהטיפול לא יצליח להשיג תוצאות משביעות רצון.",
    ];

    const secondConsentTexts = [
        "אני מצהיר/ה ומאשר/ת בזאת כי הובאו לפני והוסברו לי כל הסיכונים, תופעות הלוואי והסיבוכים הכרוכים בטיפול.",
        "הוסברה לי מהות הטיפול ואני מבין/ה שהטיפול הינו אסתטי.",
        "ידוע לי כי הטיפול יבוצע ע''י מטפלת מוסמכת ובעלת ניסיון.",
        "אני נותן/ת בזאת את הסכמתי לביצוע הטיפול על פי שיקול דעת המטפל/ת.",
    ];

    const thirdConsentTexts = [
        "אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים.",
        "התיק יכלול נתונים אישיים ונתוני הטיפולים, כולל צילומים של אזור הטיפול.",
        "כמו כן, יתועדו תגובות ותוצאות הטיפולים, מידע אישי כגון גיל, מין ואנמנזה רפואית ככל שישנן.",
    ];

    const fourthConsentTexts = [
        "אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים.",
        "התיק יכלול נתונים אישיים ונתוני הטיפולים, כולל צילומים של אזור הטיפול.",
        "כמו כן, יתועדו תגובות ותוצאות הטיפולים, מידע אישי כגון גיל, מין ואנמנזה רפואית ככל שישנן.",
    ];

    const [customerSignature, setCostumerSignature] = useState<string>("");
    const [name, setName] = useState<string>("");

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
                        if (data.signature) {
                            const signature = data.signature;
                            setCostumerSignature(signature);
                        }
                        setName(name);
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching health statement:', error);
                }
            }
        };

        fetchAnswers();
    }, [id]);

    const Statement = ({ text }: { text: string[] }) => {
        return (
            <div>
                {text.map(statement => (
                    <h3 className={styles.text}>{statement}</h3>
                ))}

                <div className={styles.agreedComtainer}>
                    <h4 className={styles.agreedText}>אושר</h4>
                    <Tick01Icon className={styles.checkIcon} />

                </div>
            </div>

        )
    }


    return (
        <div className={styles.container}>
            <h4>{name}</h4>
            <Statement text={firstConsentTexts} />
            <Statement text={secondConsentTexts} />
            <Statement text={thirdConsentTexts} />
            <Statement text={fourthConsentTexts} />
            {customerSignature !== "" ?
                <div className={styles.sugnatureContainer}>
                    <img src={customerSignature} alt="customer-signature" className={styles.sugnature} />
                </div>
                : null}
        </div>
    )
};

export default ExistingStatements;
