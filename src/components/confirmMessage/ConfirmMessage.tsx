import React from 'react';
import styles from './ConfirmMessage.module.scss';

interface DeleteAlertProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmMessage: React.FC<DeleteAlertProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.alertBox}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>כן להסיר</button>
                    <button className={styles.cancelButton} onClick={onCancel}>לא, התחרטטי</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMessage;
