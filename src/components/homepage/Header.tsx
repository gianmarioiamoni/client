import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface HeaderProps {
  appName: string;
  onLogin: () => void;
  onRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appName,
  onLogin,
  onRegister
}) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onLogin}>
              Sign In
            </Button>
            <Button onClick={onRegister}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
