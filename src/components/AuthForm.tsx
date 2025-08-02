import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, UserCheck } from "lucide-react";

interface AuthFormProps {
  onLogin: (username: string, role: 'voter' | 'admin') => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Simple password hashing (in production, use proper encryption)
      const hashedPassword = btoa(password);
      
      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[username];
        
        if (!user || user.password !== hashedPassword) {
          setError("Invalid username or password");
          return;
        }
        
        // Check if user has already voted
        const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '[]');
        if (user.role === 'voter' && votedUsers.includes(username)) {
          setError("You have already voted in this election");
          return;
        }
        
        onLogin(username, user.role);
      } else {
        // Signup logic
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
          setError("Username already exists");
          return;
        }
        
        // Determine role (first user is admin, rest are voters)
        const role = Object.keys(users).length === 0 ? 'admin' : 'voter';
        
        users[username] = {
          password: hashedPassword,
          role: role,
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        onLogin(username, role);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-civic flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-civic bg-gradient-card border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <UserCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Join the Vote"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin 
              ? "Sign in to participate in democratic voting" 
              : "Create your account to start voting"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="transition-all duration-300 focus:shadow-card"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="transition-all duration-300 focus:shadow-card"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="transition-all duration-300 focus:shadow-card"
                />
              </div>
            )}
            
            {error && (
              <Alert className="border-destructive/20 bg-destructive/10">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              variant="civic"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-primary hover:text-primary-glow"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};