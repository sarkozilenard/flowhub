import React from 'react';
import { Zap } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
        <Zap className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold text-primary">FlowHub</span>
    </div>
  );
};

export default Logo;