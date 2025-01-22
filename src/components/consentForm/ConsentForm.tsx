import styles from './ConsentForm.module.scss';

interface Props {
    onNext: () => void;
    onBack: () => void;
    header: string;
    texts: string[];
};

function ConsentForm({ onBack, onNext, header, texts }: Props) {

    const handleButtonClicked = () => {
        onNext();
        // onActive = true;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{header}</h2>
            {texts.map((text, index) => (
                <p key={index} className={styles.text}>
                    {text}
                </p>
            ))}
            <button
                type="button"
                className={styles.button}
                onClick={handleButtonClicked}
            >
                אני מאשר\ת
            </button>
        </div>
    )
}


export default ConsentForm;
