import styles from './ConsentForm.module.scss';

interface Props {
    onNext: () => void;
    onBack: () => void;
    header: string;
    text: string;
    // onActive: boolean;
};

function ConsentForm({ onBack, onNext, header, text }: Props) {

    const handleButtonClicked = () => {
        onNext();
        // onActive = true;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{header}</h2>
            <h3 className={styles.text}>{text}</h3>
            <button
                type="button"
                className={styles.button}
                onClick={() => handleButtonClicked()}
            >
                אני מאשר\ת
            </button>
        </div>
    )
}


export default ConsentForm;
