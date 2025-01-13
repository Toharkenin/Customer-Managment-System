import PersonalDetailsForm from '../../components/ClientInfoForm/PersonalDetailsForm';
import { useEffect, useRef, useState } from 'react';
import styles from './clientForm.module.scss';
import ConsentForm from '../../components/consentForm/ConsentForm';
import HealthStatement from '../../components/healthStatement/HealthStatement';

function ClientForm() {

    const personalDetailsRef = useRef<HTMLDivElement>(null);
    const firstconsentFormRef = useRef<HTMLDivElement>(null);
    const seconsConsentFormRef = useRef<HTMLDivElement>(null);
    const thirdConsentFormRef = useRef<HTMLDivElement>(null);
    const fourthConsentFormRef = useRef<HTMLDivElement>(null);
    const healthStatmentRef = useRef<HTMLDivElement>(null);

    const [showStatements, setShowStatement] = useState<boolean>(false);
    const [showHealthStatements, setShowHealthStatements] = useState<boolean>(false);
    const [customerEmail, setCustomerEmail] = useState<string>("");

    const [statmentActivity, setShowStatementActivity] = useState([
        { id: 1, active: false },
        { id: 2, active: false },
        { id: 3, active: false },
        { id: 4, active: false },
    ]);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (showStatements && firstconsentFormRef.current) {
            scrollToSection(firstconsentFormRef);
        }
    }, [showStatements]);

    useEffect(() => {
        if (showHealthStatements && healthStatmentRef.current) {
            scrollToSection(healthStatmentRef);
        }
    }, [showHealthStatements]);


    const setActiveButton = (id: number) => {
        setShowStatementActivity(prevState =>
            prevState.map(statement =>
                statement.id === id ? { ...statement, active: true } : statement
            )
        );
    };

    const addToDB = () => {
        const areAllStatementsActive = statmentActivity.every(statement => statement.active);

        //TODO: add to Db -- How to get the user and check if exist..
    }
    return (
        <div className={styles.container}>
            <div ref={personalDetailsRef} className={styles.infoSection}>
                <PersonalDetailsForm
                    onNext={() => { setShowStatement(true) }}
                    customerEmail={setCustomerEmail} />
            </div>
            {showStatements &&
                <>
                    <div style={{ marginTop: 100 }} ref={firstconsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(personalDetailsRef)}
                            header="טופס הסכמה לטיפול בהסרת שיער בטכנולוגיית לייזר"
                            text="אודות הטיפול טיפול הסרת שיער המתבצע באמצעות טכנולוגיית לייזר המאפשרת חימום הדרגתי של זקיק השערה והרקמה לאורך זמן ותוך כדי תנועה. תאום ציפיות התוצאות הקליניות של הטיפול עשויות להשתנות מאדם לאדם בהתאם לתכונותיו הפיזיולוגיות, גילו ומינו ובהתאם למצב המטופל. מסיבות אלו לא ניתן לחזות במדויק את מספר הטיפולים הנדרשים להשגת תוצאה אופטימאלית ולכן מספר הטיפולים הנדרשים שונה בין אדם לאדם. לפי מחקרים רפואיים, באחוז נמוך מהמקרים, לא יושגו תוצאות משביעות רצון במהלך הטיפולים. אין הסבר מדעי לכך והסיבה טמונה ככל הנראה בהבדלים פיזיולוגיים בין אדם לאדם. מהלך הטיפול ותהליך ההחלמה: תיתכן אי נוחות מסוימת, תחושת חום, עקצוץ או כאבים במהלך הטיפול. תיתכן הופעת אדמומיות )Erythema( ו/או גרד אשר יחלפו, בדרך כלל, כיום עד יומיים לאחר הטיפול. תהליך החלמת העור עשוי להימשך מספר ימים עד מספר שבועות במקרים חריגים. לעיתים נדירות, תופיע באזור המטופל תגובת רגישות יתר ,שתתבטא בנפיחות או בצקת, שלפוחיות, כוויה שטחית, גלדים, חבורות זמניות, תגובות אלרגיות והופעת פצעונים אשר יחלפו תוך מספר שעות/ימים עם ו/או בלי קבלת טיפול מתאים. במקרים של תגובת רגישות יתר יש לפנות לאבחון וטיפול רפואי. עלולים להיות שינויים זמניים בגוון העור באזור שטופל. שינויים אלה חולפים לרוב תוך מספר שבועות – חודשים מתום הטיפול."
                            onNext={() => {
                                scrollToSection(seconsConsentFormRef)
                                setActiveButton(1)
                            }}
                            onActive={true}
                        />
                    </div>

                    <div style={{ marginTop: 100 }} ref={seconsConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(firstconsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            text="אני מצהיר/ה ומאשר/ת בזאת כי הובאו לפני והוסברו לי כל הסיכונים, תופעות הלוואי והסיבוכים הכרוכים בטיפול כמפורט להלן. ידוע לי כי הטיפול יעשה ע''י מטפלת מוסמכת ובעלת ניסיון. הוסברה לי מהות הטיפול ואני מבין/ה שהטיפול הינו אסתטי. כמו-כן, הוסברה לי האפשרות שמטרת הטיפול לא תושג במלואה או לא תושג כלל במקרים נדירים. אני מצהיר/ה ומאשר/ת בזאת כי ביטאתי את בקשתי וציפיותיי לטיפול וכי קיבלתי הסבר מפורט על תהליך הטיפול, השלכותיו והסיכונים הכרוכים בטיפול ותופעות הלוואי לרבות: אופי ואופן הטיפול, התוצאות המצופות ממנו לרבות ההיבטים המקצועיים וסייגים המהווים חלק בלתי נפרד מתאום הציפיות. אני נותן/ת בזאת את הסכמתי לביצוע הטיפול על פי שיקול הדעת של המטפל/ת."
                            onNext={() => {
                                scrollToSection(thirdConsentFormRef)
                                setActiveButton(2)
                            }}
                            onActive
                        />
                    </div>
                    <div style={{ marginTop: 100 }} ref={thirdConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(seconsConsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            text="אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים בו ירשמו ויתועדו נתוני האישיים ונתוני הטיפולים לרבות צילומים של אזור הטיפול, תגובות ותוצאות הטיפולים ומידע אישי )גיל, מין ואנמנזה רפואית, ככל שישנן(."
                            onNext={() => {
                                scrollToSection(fourthConsentFormRef)
                                setActiveButton(3)
                            }}
                            onActive
                        />
                    </div>
                    <div style={{ marginTop: 100 }} ref={fourthConsentFormRef} className={styles.statementsSection}>
                        <ConsentForm
                            onBack={() => scrollToSection(thirdConsentFormRef)}
                            header="הצהרת המטופל/ת:"
                            text="אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים בו ירשמו ויתועדו נתוני האישיים ונתוני הטיפולים לרבות צילומים של אזור הטיפול, תגובות ותוצאות הטיפולים ומידע אישי )גיל, מין ואנמנזה רפואית, ככל שישנן(."
                            onNext={() => {
                                setShowHealthStatements(true)
                                setActiveButton(4)
                                addToDB();
                            }}
                            onActive
                        />
                    </div>
                </>
            }
            {
                showHealthStatements &&
                <div style={{ marginTop: 100 }} ref={healthStatmentRef}>
                    <HealthStatement
                        // onBack={() => scrollToSection(firstconsentFormRef)}
                        customerEmail={customerEmail}
                    />
                </div>
            }
        </div>
    )
};

export default ClientForm;
