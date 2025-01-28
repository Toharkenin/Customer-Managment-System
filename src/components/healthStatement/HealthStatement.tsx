import React, { useState } from 'react';
import styles from './HealthStatement.module.scss';
import { useNavigate, useParams } from 'react-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Props {
    onNext: () => void;
    customerEmail: string;
};

interface Question {
    id: number;
    text: string;
};

function HealthStatement({ customerEmail, onNext }: Props) {

    const { id } = useParams();

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

    const initialQuestions = questions.slice(0, 6);
    const remainingQuestions = questions.slice(6);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [answers, setAnswers] = useState(
        initialQuestions.concat(remainingQuestions).map((question) => ({
            id: question.id,
            checkbox: "",
            answer: "",
        }))
    );



    const isFormValid = () => {
        return answers.every(
            (answer) =>
                answer.checkbox &&
                (answer.checkbox === "no" || (answer.checkbox === "yes" && answer.answer.trim() !== ""))
        );
    };

    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleAnswerChange = (id: number, field: "checkbox" | "answer", value: string) => {
        setAnswers((prev) =>
            prev.map((answer) =>
                answer.id === id
                    ? { ...answer, [field]: value }
                    : answer
            )
        );
        if (field === "answer") {
            setErrorMessage("");
        }
    };


    const handleDetailAnswerChange = (questionId: number, value: string) => {

        setAnswers((prevAnswers) =>
            prevAnswers.map((a) =>
                a.id === questionId ? { ...a, answer: value } : a
            )
        );

    };



    const QuestionComponent = React.memo(({ question }: { question: Question }) => {
        const currentAnswer = answers.find((a) => a.id === question.id);
        const [localAnswer, setLocalAnswer] = useState(
            answers.find((a) => a.id === question.id)?.answer || ''
        );

        const handleBlur = () => {
            handleDetailAnswerChange(question.id, localAnswer);
        };

        return (
            <div key={question.id} className={styles.questionContainer}>
                <p className={styles.question}>{question.text}</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>
                        <input
                            type="radio"
                            className={styles.radio}
                            name={`question-${question.id}`}
                            checked={currentAnswer?.checkbox === 'yes'}
                            onChange={() => handleAnswerChange(question.id, 'checkbox', 'yes')}
                            required
                        />
                        כן
                    </label>
                    <label style={{ marginTop: '1rem' }}>
                        <input
                            className={styles.radio}
                            type="radio"
                            name={`question-${question.id}`}
                            checked={currentAnswer?.checkbox === 'no'}
                            onChange={() => handleAnswerChange(question.id, 'checkbox', 'no')}
                            required
                        />
                        לא
                    </label>
                </div>
                <br />
                {currentAnswer?.checkbox === 'yes' && (
                    <div className={styles.details}>
                        <input
                            type="text"
                            placeholder="פירוט"
                            value={localAnswer}
                            onChange={(e) => setLocalAnswer(e.target.value)}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                )}
            </div>
        );
    });

    const handleSendForm = async () => {
        if (!isFormValid()) {
            setErrorMessage("אנא מלא/י את כל השדות הנדרשים לפני שליחה");
            setTimeout(() => {
                setErrorMessage("");
            }, 2000)
            return;


        }
        if (customerEmail) onNext();

        const allAnswers = answers.map((a) => ({
            questionId: a.id,
            checkbox: a.checkbox,
            answer: a.answer,
        }));

        try {
            const customerRef = doc(db, 'customers', id || customerEmail);
            await updateDoc(customerRef, {
                HealthStatement: allAnswers,
            });
            if (id) {
                setSuccessMessage("טופס נשלח בהצלחה");
                setTimeout(() => {
                    navigate(`/Confirmation/${id}`);
                }, 2000);
            }

        } catch (error) {
            console.error("Error adding array:", error);
        }
        // }
    };



    return (
        <div className={styles.container}>
            <h2 className={styles.header}>הצהרת בריאות</h2>
            <h4 className={styles.topText}>השאלון הוא סודי בהחלט ומשמש את צוות הקורס/קליניקה בלבד *</h4>
            <div className={styles.questions}>
                <div>
                    {initialQuestions.map((question) => (
                        <QuestionComponent key={question.id} question={question} />
                    ))}
                </div>

                <h3 className={styles.header2}>האם היה לך / יש לך כעת</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {remainingQuestions.slice(0, 13).map((question) => (
                            <QuestionComponent key={question.id} question={question} />
                        ))}
                    </div>

                    <div>
                        {remainingQuestions.slice(13, 25).map((question) => (
                            <QuestionComponent key={question.id} question={question} />
                        ))}
                    </div>
                </div>
            </div>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            <button type='submit' className={styles.sendButton} onClick={handleSendForm}>
                שליחה
            </button>

        </div>
    )
}

export default HealthStatement;
