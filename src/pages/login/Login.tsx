import { useState } from "react";
import styles from './Login.module.scss';
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        console.log("handleLogin");
        try {
            const adminRef = collection(db, "Admin");
            const data = query(adminRef, where("email", "==", email.toLowerCase()));
            const querySnapshot = await getDocs(data);

            if (!querySnapshot.empty) {


                querySnapshot.forEach((doc) => {
                    const adminData = doc.data();
                    const adminPassword = adminData.password;
                    if (adminPassword !== password) {
                        setError("הסיסמא שהזנת לא נכונה, נסה שנית");
                    }
                });
            } else {
                setError("אימייל לא קיים במערכת, נסה שנית")
            }
        } catch (error) {
            console.error("Error checking user:", error);
            setError("An error occurred while logging in.");
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const success = await handleLogin();

        setLoading(false);
        if (success) {
            console.log("Login successful");
        } else {
            console.log("Login failed");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>התחברות</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>אימייל</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="אימייל"
                            required
                        />
                        <label htmlFor="password" className={styles.label}>סיסמא</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="סיסמא"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "מתחבר..." : "התחברות"}
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;
