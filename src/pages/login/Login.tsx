import { useState } from "react";
import styles from './Login.module.scss';
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";


function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const auth = getAuth();
        try {
            const adminCredential = await signInWithEmailAndPassword(auth, email, password);
            const admin = adminCredential.user;
            localStorage.setItem("loginTime", Date.now().toString());

            if (!admin) {
                console.error("No user found");
                return;
            }

            const adminRef = collection(db, "Admin");
            const q = query(adminRef, where("email", "==", email));
            const adminSnapshot = await getDocs(q);
            if (!adminSnapshot.empty) {
                const adminData = adminSnapshot.docs[0].data();
                if (adminData.role === "admin") {
                    console.log("Admin login successful");
                    navigate("/");
                }
            }
        } catch (error) {
            setError("הפרטים שהזנת אינם נכונים");
            setEmail("");
            setPassword("");
            setTimeout(() => {
                setError("");
            }, 2000);

        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        await handleLogin();
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>התחברות</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        {/* <label htmlFor="email" className={styles.label}>אימייל</label> */}
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="אימייל"
                            maxLength={30}
                            required
                        />
                        {/* <label htmlFor="password" className={styles.label}>סיסמא</label> */}
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="סיסמא"
                            maxLength={30}
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
