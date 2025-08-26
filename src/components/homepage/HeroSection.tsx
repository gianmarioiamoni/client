import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onViewDemo
}) => {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Real-time Task
        <span className="text-blue-600"> Collaboration</span>
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Experience the future of team productivity with our real-time collaborative task board. 
        See updates instantly, chat with your team, and manage projects like never before.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          size="lg" 
          className="px-8 py-3"
          onClick={onGetStarted}
        >
          Start Free Trial
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-8 py-3"
          onClick={onViewDemo}
        >
          View Demo
        </Button>
      </div>
    </div>
  );
};
