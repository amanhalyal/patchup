import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function PrivateRoute({ children }) {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (authState === null) {
    return null; // Or a loading indicator
  }

  return authState ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
