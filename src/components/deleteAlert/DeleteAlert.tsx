import React from 'react';
import styles from './DeleteAlert.module.scss';

interface DeleteAlertProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.alertBox}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>כן, למחוק</button>
                    <button className={styles.cancelButton} onClick={onCancel}>לא, התחרטטי</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;
