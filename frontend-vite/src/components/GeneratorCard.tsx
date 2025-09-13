import React from 'react';
import { Mail, MessageCircle, Users, ArrowRight } from 'lucide-react';
import { GeneratorType } from '../lib/types';

interface GeneratorCardProps {
  type: GeneratorType;
  title: string;
  description: string;
  features: string[];
  onSelect: (type: GeneratorType) => void;
}

const iconMap = {
  email: Mail,
  linkedin: MessageCircle,
  referral: Users,
};

export function GeneratorCard({ 
  type, 
  title, 
  description, 
  features, 
  onSelect 
}: GeneratorCardProps) {
  const IconComponent = iconMap[type];

  return (
    <div className="group relative bg-surface border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-glow hover:transform hover:scale-[1.02]">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500"></div>
      
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-lg bg-gradient-primary/10 flex items-center justify-center group-hover:bg-gradient-primary/20 transition-all duration-300">
          <IconComponent className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 opacity-60"></div>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(type)}
          className="group/btn w-full cyber-button flex items-center justify-center space-x-2 text-primary group-hover:text-primary-foreground group-hover:bg-primary transition-all duration-300"
        >
          <span className="font-medium">Start Generating</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10"></div>
    </div>
  );
}