import { useEffect, useRef, useState } from 'react';
import styles from './StatementsPage.module.scss';
import ConsentForm from '../../components/consentForm/ConsentForm';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import VIcon from '../../assets/V-icon';

function StatementsPage() {

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

    const personalDetailsRef = useRef<HTMLDivElement>(null);
    const firstconsentFormRef = useRef<HTMLDivElement>(null);
    const seconsConsentFormRef = useRef<HTMLDivElement>(null);
    const thirdConsentFormRef = useRef<HTMLDivElement>(null);
    const fourthConsentFormRef = useRef<HTMLDivElement>(null);

    const { id } = useParams();

    const [showStatements, setShowStatements] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const navigate = useNavigate();

    const [statmentActivity, setShowStatementActivity] = useState([
        { id: 1, active: false },
        { id: 2, active: false },
        { id: 3, active: false },
    ]);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


    const setActiveButton = (id: number) => {
        setShowStatementActivity(prevState =>
            prevState.map(statement =>
                statement.id === id ? { ...statement, active: true } : statement
            )
        );
    };

    const addToDB = async () => {
        const areAllStatementsActive = statmentActivity.every(statement => statement.active);
        console.log()
        if (!areAllStatementsActive) {
            setErrorMessage("אנא אשר\י את כל השדות הנדרשים לפני שליחה");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000)
            return;
        }

        try {
            if (id) {
                setSuccessMessage("טופס נשלח בהצלחה")
                const customerRef = doc(db, 'customers', id);
                await updateDoc(customerRef, {
                    statements: new Date(),
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error("Error adding array:", error);
        }

    }
    return (
        <div className={styles.container}>
            {showStatements &&
                <>
                    <div ref={firstconsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(personalDetailsRef)}
                            header="טופס הסכמה לטיפול בהסרת שיער בטכנולוגיית לייזר"
                            texts={firstConsentTexts}
                            onNext={() => {
                                scrollToSection(seconsConsentFormRef)
                                setActiveButton(1)
                            }}
                        />
                    </div>

                    <div ref={seconsConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(firstconsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            texts={secondConsentTexts}
                            onNext={() => {
                                scrollToSection(thirdConsentFormRef)
                                setActiveButton(2)
                            }}
                        />
                    </div>
                    <div ref={thirdConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(seconsConsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            texts={thirdConsentTexts}
                            onNext={() => {
                                scrollToSection(fourthConsentFormRef)
                                setActiveButton(3)
                            }}
                        />
                    </div>
                    <div ref={fourthConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(thirdConsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            texts={fourthConsentTexts}
                            onNext={() => {
                                addToDB();
                            }}
                        />
                        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                    </div>
                </>
            }
        </div>
    )
};

export default StatementsPage;
