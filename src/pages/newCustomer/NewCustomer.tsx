import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./newCustomer.module.scss";
import PersonalDetailsForm from "../../components/personalInfoForm/PersonalDetailsForm";
import ConsentForm from "../../components/consentForm/ConsentForm";
import HealthStatement from "../../components/healthStatement/HealthStatement";
import Confirmation from "../../components/confirmation/Confirmation";

function NewCustomer() {
    const steps = ["PersonalDetails", "statement1", "statement2", "statement3", "healthStatement", "confirm"];
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [customerEmail, setCustomerEmail] = useState<string>("");
    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };


    const renderStepComponent = () => {
        switch (steps[currentStep]) {
            case "PersonalDetails":
                return (
                    <PersonalDetailsForm
                        onNext={handleNextStep}
                        customerEmail={setCustomerEmail}
                    />
                );
            case "statement1":
                return (
                    <ConsentForm
                        header="טופס הסכמה לטיפול בהסרת שיער בטכנולוגיית לייזר"
                        text="אודות הטיפול טיפול הסרת שיער המתבצע באמצעות טכנולוגיית לייזר המאפשרת חימום הדרגתי של זקיק השערה והרקמה לאורך זמן ותוך כדי תנועה. תאום ציפיות התוצאות הקליניות של הטיפול עשויות להשתנות מאדם לאדם בהתאם לתכונותיו הפיזיולוגיות, גילו ומינו ובהתאם למצב המטופל. מסיבות אלו לא ניתן לחזות במדויק את מספר הטיפולים הנדרשים להשגת תוצאה אופטימאלית ולכן מספר הטיפולים הנדרשים שונה בין אדם לאדם. לפי מחקרים רפואיים, באחוז נמוך מהמקרים, לא יושגו תוצאות משביעות רצון במהלך הטיפולים. אין הסבר מדעי לכך והסיבה טמונה ככל הנראה בהבדלים פיזיולוגיים בין אדם לאדם. מהלך הטיפול ותהליך ההחלמה: תיתכן אי נוחות מסוימת, תחושת חום, עקצוץ או כאבים במהלך הטיפול. תיתכן הופעת אדמומיות )Erythema( ו/או גרד אשר יחלפו, בדרך כלל, כיום עד יומיים לאחר הטיפול. תהליך החלמת העור עשוי להימשך מספר ימים עד מספר שבועות במקרים חריגים. לעיתים נדירות, תופיע באזור המטופל תגובת רגישות יתר ,שתתבטא בנפיחות או בצקת, שלפוחיות, כוויה שטחית, גלדים, חבורות זמניות, תגובות אלרגיות והופעת פצעונים אשר יחלפו תוך מספר שעות/ימים עם ו/או בלי קבלת טיפול מתאים. במקרים של תגובת רגישות יתר יש לפנות לאבחון וטיפול רפואי. עלולים להיות שינויים זמניים בגוון העור באזור שטופל. שינויים אלה חולפים לרוב תוך מספר שבועות – חודשים מתום הטיפול."
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                    />
                );
            case "statement2":
                return (
                    <ConsentForm
                        header="הצהרת המטופל/ת:"
                        text="אני מצהיר/ה ומאשר/ת בזאת כי הובאו לפני והוסברו לי כל הסיכונים, תופעות הלוואי והסיבוכים הכרוכים בטיפול כמפורט להלן. ידוע לי כי הטיפול יעשה ע''י מטפלת מוסמכת ובעלת ניסיון. הוסברה לי מהות הטיפול ואני מבין/ה שהטיפול הינו אסתטי. כמו-כן, הוסברה לי האפשרות שמטרת הטיפול לא תושג במלואה או לא תושג כלל במקרים נדירים. אני מצהיר/ה ומאשר/ת בזאת כי ביטאתי את בקשתי וציפיותיי לטיפול וכי קיבלתי הסבר מפורט על תהליך הטיפול, השלכותיו והסיכונים הכרוכים בטיפול ותופעות הלוואי לרבות: אופי ואופן הטיפול, התוצאות המצופות ממנו לרבות ההיבטים המקצועיים וסייגים המהווים חלק בלתי נפרד מתאום הציפיות. אני נותן/ת בזאת את הסכמתי לביצוע הטיפול על פי שיקול הדעת של המטפל/ת."
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                    />
                );
            case "statement3":
                return (
                    <ConsentForm
                        header="הצהרת המטופל/ת:"
                        text="אני מאשר/ת את הסכמתי לפתיחת תיק מעקב טיפולים בו ירשמו ויתועדו נתוני האישיים ונתוני הטיפולים לרבות צילומים של אזור הטיפול, תגובות ותוצאות הטיפולים ומידע אישי )גיל, מין ואנמנזה רפואית, ככל שישנן(."
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                    />
                );
            case "healthStatement":
                return (
                    <HealthStatement
                        onNext={handleNextStep}
                        customerEmail={""}
                    />
                );
            case "confirm":
                return (
                    <div>
                        <h3>Confirmation</h3>
                        <Confirmation />
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

            {/* <div className={styles.buttons}>
                <button onClick={handlePrevStep} disabled={currentStep === 0}>
                    Previous
                </button>
                <button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
                    Next
                </button>
            </div> */}
        </div>
    );
}

export default NewCustomer;
