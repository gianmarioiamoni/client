import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Ready to Transform Your Team&apos;s Productivity?
      </h3>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Join thousands of teams already using our real-time task board to streamline 
        their workflow and boost collaboration.
      </p>
      
      <Button 
        size="lg" 
        className="px-8 py-3"
        onClick={onGetStarted}
      >
        Get Started Free
      </Button>
    </div>
  );
};
