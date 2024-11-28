import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Feed } from './pages/Feed';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to="/feed" /> : <>{children}</>;
}

function App() {
  const initializeUser = useAuthStore((state) => state.initializeUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from token and set loading state
    initializeUser();
    setLoading(false);
  }, [initializeUser]);

  if (loading) {
    // Show a loading screen while user state is being initialized
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users away from login/register */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginForm />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <RegisterForm />
            </RedirectIfAuthenticated>
          }
        />
        {/* Protect feed route */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        {/* Redirect root to feed */}
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </Router>
  );
}

export default App;
