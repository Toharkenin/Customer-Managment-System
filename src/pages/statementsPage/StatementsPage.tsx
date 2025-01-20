import { useEffect, useRef, useState } from 'react';
import styles from './StatementsPage.module.scss';
import ConsentForm from '../../components/consentForm/ConsentForm';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

function StatementsPage() {

    const personalDetailsRef = useRef<HTMLDivElement>(null);
    const firstconsentFormRef = useRef<HTMLDivElement>(null);
    const seconsConsentFormRef = useRef<HTMLDivElement>(null);
    const thirdConsentFormRef = useRef<HTMLDivElement>(null);
    const fourthConsentFormRef = useRef<HTMLDivElement>(null);

    const { id } = useParams();

    const [showStatements, setShowStatement] = useState<boolean>(true);
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
                            text="אודות הטיפול טיפול הסרת שיער המתבצע באמצעות טכנולוגיית לייזר המאפשרת חימום הדרגתי של זקיק השערה והרקמה לאורך זמן ותוך כדי תנועה. תאום ציפיות התוצאות הקליניות של הטיפול עשויות להשתנות מאדם לאדם בהתאם לתכונותיו הפיזיולוגיות, גילו ומינו ובהתאם למצב המטופל. מסיבות אלו לא ניתן לחזות במדויק את מספר הטיפולים הנדרשים להשגת תוצאה אופטימאלית ולכן מספר הטיפולים הנדרשים שונה בין אדם לאדם. לפי מחקרים רפואיים, באחוז נמוך מהמקרים, לא יושגו תוצאות משביעות רצון במהלך הטיפולים. אין הסבר מדעי לכך והסיבה טמונה ככל הנראה בהבדלים פיזיולוגיים בין אדם לאדם. מהלך הטיפול ותהליך ההחלמה: תיתכן אי נוחות מסוימת, תחושת חום, עקצוץ או כאבים במהלך הטיפול. תיתכן הופעת אדמומיות )Erythema( ו/או גרד אשר יחלפו, בדרך כלל, כיום עד יומיים לאחר הטיפול. <br />תהליך החלמת העור עשוי להימשך מספר ימים עד מספר שבועות במקרים חריגים. לעיתים נדירות, תופיע באזור המטופל תגובת רגישות יתר ,שתתבטא בנפיחות או בצקת, שלפוחיות, כוויה שטחית, גלדים, חבורות זמניות, תגובות אלרגיות והופעת פצעונים אשר יחלפו תוך מספר שעות/ימים עם ו/או בלי קבלת טיפול מתאים. במקרים של תגובת רגישות יתר יש לפנות לאבחון וטיפול רפואי. עלולים להיות שינויים זמניים בגוון העור באזור שטופל. שינויים אלה חולפים לרוב תוך מספר שבועות – חודשים מתום הטיפול."
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
                            text="אני מצהיר/ה ומאשר/ת בזאת כי הובאו לפני והוסברו לי כל הסיכונים, תופעות הלוואי והסיבוכים הכרוכים בטיפול כמפורט להלן. ידוע לי כי הטיפול יעשה ע''י מטפלת מוסמכת ובעלת ניסיון. הוסברה לי מהות הטיפול ואני מבין/ה שהטיפול הינו אסתטי. כמו-כן, הוסברה לי האפשרות שמטרת הטיפול לא תושג במלואה או לא תושג כלל במקרים נדירים. אני מצהיר/ה ומאשר/ת בזאת כי ביטאתי את בקשתי וציפיותיי לטיפול וכי קיבלתי הסבר מפורט על תהליך הטיפול, השלכותיו והסיכונים הכרוכים בטיפול ותופעות הלוואי לרבות: אופי ואופן הטיפול, התוצאות המצופות ממנו לרבות ההיבטים המקצועיים וסייגים המהווים חלק בלתי נפרד מתאום הציפיות. אני נותן/ת בזאת את הסכמתי לביצוע הטיפול על פי שיקול הדעת של המטפל/ת."
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
                            text="אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים בו ירשמו ויתועדו נתוני האישיים ונתוני הטיפולים לרבות צילומים של אזור הטיפול, תגובות ותוצאות הטיפולים ומידע אישי )גיל, מין ואנמנזה רפואית, ככל שישנן(."
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
                            text="אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים בו ירשמו ויתועדו נתוני האישיים ונתוני הטיפולים לרבות צילומים של אזור הטיפול, תגובות ותוצאות הטיפולים ומידע אישי )גיל, מין ואנמנזה רפואית, ככל שישנן(."
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
