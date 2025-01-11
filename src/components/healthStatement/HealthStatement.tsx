import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'
import styles from './HealthStatement.module.scss';
import { NavLink } from 'react-router';

interface Props {
    onBack: () => void;
};

interface Question {
    id: number;
    text: string;
};

function HealthStatement({ onBack }: Props) {

    const [answers, setAnswers] = useState<Record<number, { checkbox?: string; details?: string }>>({});
    const sigPadRef = useRef<SignatureCanvas>(null);

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

    const handleAnswerChange = (id: number, type: string, value?: string) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                [type]: value || type,
            },
        }));
    };

    const QuestionComponent = ({ question }: { question: Question }) => {
        return (
            <div key={question.id} className={styles.questionContainer}>
                <p className={styles.question}>{question.text}</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={answers[question.id]?.checkbox === 'yes'}
                            onChange={() => handleAnswerChange(question.id, 'checkbox', 'yes')}
                        />
                        כן
                    </label>
                    <label style={{ marginTop: '1rem' }}>

                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={answers[question.id]?.checkbox === 'no'}
                            onChange={() => handleAnswerChange(question.id, 'checkbox', 'no')}
                        />
                        לא
                    </label>
                </div>
                <br />
                {answers[question.id]?.checkbox === 'yes' && (
                    <div className={styles.details}>
                        <input
                            className={styles.detailsInput}
                            type="text"
                            name={`question-${question.id}`}
                            placeholder='פירוט'
                            onChange={(e) =>
                                handleAnswerChange(question.id, 'details', e.target.value)
                            }
                        />
                    </div>
                )}
            </div>
        );
    };

    const initialQuestions = questions.slice(0, 6);
    const remainingQuestions = questions.slice(6);

    const handleClearSign = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
        }
    };

    // TODO: Add data to firebase

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

                <h3 className={styles.header}>האם היה לך / יש לך כעת</h3>

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
            <div>
                <h3>הצהרה:</h3>
                <div className={styles.authorazation}>
                    <input
                        type="checkbox"
                        name="authorazation"
                        // checked={ }
                        // onChange={}
                        required />
                    <h5>אני מצהיר\ה בזה כי הפרטים שמסרתי לעיל הם נכונים</h5>
                </div>
            </div>
            <div className="styles.date">
                <input type='date' className={styles.dateInputContainer} />

            </div>
            <div className={styles.signatureContainer}>
                <div style={{ border: '1px solid black', width: 500 }}>
                    <SignatureCanvas penColor='black'
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                        ref={sigPadRef}
                    />
                </div>
                <button onClick={handleClearSign} className={styles.clearButton}>מחיקה</button>
            </div>

            <NavLink to="/">
                <button className={styles.sendButton}>שליחה</button>
            </NavLink>
        </div>
    )
}

export default HealthStatement;
