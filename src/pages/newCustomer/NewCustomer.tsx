import { useState } from "react";
import styles from "./newCustomer.module.scss";
import PersonalDetailsForm from "../../components/personalInfoForm/PersonalDetailsForm";
import ConsentForm from "../../components/consentForm/ConsentForm";
import HealthStatement from "../../components/healthStatement/HealthStatement";
import Confirmation from "../../components/confirmation/Confirmation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

function NewCustomer() {

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
        "אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים.",
        "התיק יכלול נתונים אישיים ונתוני הטיפולים, כולל צילומים של אזור הטיפול.",
        "כמו כן, יתועדו תגובות ותוצאות הטיפולים, מידע אישי כגון גיל, מין ואנמנזה רפואית ככל שישנן.",
    ];


    const steps = ["PersonalDetails", "statement1", "statement2", "statement3", "healthStatement", "confirm"];
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [customerEmail, setCustomerEmail] = useState<string>("");

    const handleNextStep = (lastStatemrnt: boolean) => {
        if (lastStatemrnt) {
            addStatementsToDB();
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const addStatementsToDB = async () => {
        try {
            const customerRef = doc(db, 'customers', customerEmail);
            await updateDoc(customerRef, {
                statements: true,
            });
        } catch (error) {
            console.error("Error adding array:", error);
        }
    };


    const renderStepComponent = () => {
        switch (steps[currentStep]) {
            case "PersonalDetails":
                return (
                    <PersonalDetailsForm
                        onNext={() => handleNextStep(false)}
                        customerEmail={setCustomerEmail}
                    />
                );
            case "statement1":
                return (
                    <ConsentForm
                        header="טופס הסכמה לטיפול בהסרת שיער בטכנולוגיית לייזר"
                        texts={firstConsentTexts}
                        onNext={() => handleNextStep(false)}
                        onBack={handlePrevStep}
                    />
                );
            case "statement2":
                return (
                    <ConsentForm
                        header="הצהרת המטופל/ת:"
                        texts={secondConsentTexts}
                        onNext={() => handleNextStep(false)}
                        onBack={handlePrevStep}
                    />
                );
            case "statement3":
                return (
                    <ConsentForm
                        header="הצהרת המטופל/ת:"
                        texts={thirdConsentTexts}
                        onNext={() => handleNextStep(true)}
                        onBack={handlePrevStep}
                    />
                );
            case "healthStatement":
                return (
                    <HealthStatement
                        onNext={() => handleNextStep(false)}
                        customerEmail={customerEmail}
                    />
                );
            case "confirm":
                return (
                    <div>
                        <h3>Confirmation</h3>
                        <Confirmation customerEmail={customerEmail} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.stepContainer}>
                {steps.map((step, index) => (
                    <div key={index} className={styles.step}>
                        <div
                            className={`${styles.circle} ${index <= currentStep ? styles.active : ""}`}
                        // onClick={handlePrevStep}
                        >
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`${styles.line} ${index < currentStep ? styles.active : ""}`}></div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                {renderStepComponent()}
            </div>
        </div>
    );
}

export default NewCustomer;
