import { useState } from 'react';
import styles from './ConsentForm.module.scss';
import Tick01Icon from '../../assets/V-icon';

interface Props {
    onNext: () => void;
    header: string;
    texts: string[];
};

function ConsentForm({ onNext, header, texts, }: Props) {

    const [buttonActive, setButtonActive] = useState<boolean>(false);

    const handleButtonClicked = () => {
        onNext();
        setButtonActive(true);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>{header}</h2>
            {texts.map((text, index) => (
                <p key={index} className={styles.text}>
                    {text}
                </p>
            ))}

            {!buttonActive ? <button
                type="button"
                className={styles.button}
                onClick={handleButtonClicked}
            >
                אני מאשר\ת
            </button> :
                <div className={styles.agreedComtainer}>
                    <h4 className={styles.agreedText}>אושר</h4>
                    <Tick01Icon className={styles.checkIcon} />

                </div>}
        </div>
    )
}


export default ConsentForm;
