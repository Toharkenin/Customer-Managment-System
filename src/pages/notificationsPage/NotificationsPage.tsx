import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import styles from "./NotificationsPage.module.scss"
import { motion, AnimatePresence } from "framer-motion";

const NotificationsPage = () => {
    // const [notifications, setNotifications] = useState<
    //     { id: string; message: string; adminRead: boolean }[]
    // >([]);

    // useEffect(() => {
    //     const q = query(
    //         collection(db, "notifications"),
    //         where("adminRead", "==", false)
    //     );

    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //         const newNotifications = snapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         })) as any[];

    //         setNotifications(newNotifications);
    //     });

    //     return () => unsubscribe();
    // }, []);

    // const markAsRead = async (id: string) => {
    //     const notificationRef = doc(db, "notifications", id);
    //     await updateDoc(notificationRef, { adminRead: true });
    // };

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>התראות</h3>
            <div className={styles.notificationsContainer}></div>
            {/* <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={styles.notificationPopup}
                    >
                        <span>{notification.message}</span>
                        <button onClick={() => markAsRead(notification.id)} className={styles.dismissBtn}>
                            Dismiss
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence> */}
        </div>
    );
};

export default NotificationsPage;
