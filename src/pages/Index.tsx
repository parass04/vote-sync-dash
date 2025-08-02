import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { VotingDashboard } from "@/components/VotingDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

interface User {
  username: string;
  role: 'voter' | 'admin';
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string, role: 'voter' | 'admin') => {
    const userData = { username, role };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-civic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard username={user.username} onLogout={handleLogout} />;
  }

  return <VotingDashboard username={user.username} onLogout={handleLogout} />;
};

export default Index;
