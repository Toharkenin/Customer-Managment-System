import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const location = useLocation();

    if (loading) return <p>Loading...</p>;
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;