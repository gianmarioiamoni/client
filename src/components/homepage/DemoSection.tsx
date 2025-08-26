import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface DemoSectionProps {
    onTryDemo: () => void;
}

export const DemoSection: React.FC<DemoSectionProps> = ({ onTryDemo }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    See It In Action
                </h3>
                <p className="text-gray-600">
                    Watch how teams collaborate in real-time with our WebSocket-powered task board
                </p>
            </div>

            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-500 mb-4">Interactive Demo Coming Soon</p>
                    <Button onClick={onTryDemo}>
                        Try Demo Board
                    </Button>
                </div>
            </div>
        </div>
    );
};
