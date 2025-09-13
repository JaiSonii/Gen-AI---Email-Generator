import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Database, Brain, Code, Target } from 'lucide-react';

interface FuturisticLoaderProps {
  stage?: string;
  fullscreen?: boolean;
  className?: string;
}

const loadingStages = [
  { 
    text: '> Initializing cognitive matrix...', 
    icon: Brain,
    duration: 2000 
  },
  { 
    text: '> Analyzing career trajectory from resume...', 
    icon: Database,
    duration: 3000 
  },
  { 
    text: '> Deconstructing job requirements...', 
    icon: Code,
    duration: 2500 
  },
  { 
    text: '> Identifying keyword synergy...', 
    icon: Target,
    duration: 2000 
  },
  { 
    text: '> Crafting persuasive narrative...', 
    icon: Zap,
    duration: 3500 
  },
  { 
    text: '> Finalizing communication protocol...', 
    icon: Cpu,
    duration: 2000 
  },
];

export function FuturisticLoader({ 
  stage, 
  fullscreen = true, 
  className = '' 
}: FuturisticLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (stage) {
      setDisplayText(stage);
      return;
    }

    let stageTimer: NodeJS.Timeout;
    let typeTimer: NodeJS.Timeout;

    const typeText = (text: string, callback?: () => void) => {
      setIsTyping(true);
      setDisplayText('');
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
          typeTimer = setTimeout(type, 50);
        } else {
          setIsTyping(false);
          callback?.();
        }
      };
      
      type();
    };

    const runStage = (index: number) => {
      if (index >= loadingStages.length) {
        setCurrentStage(0);
        index = 0;
      }

      const currentStageData = loadingStages[index];
      setCurrentStage(index);
      
      typeText(currentStageData.text, () => {
        stageTimer = setTimeout(() => {
          runStage(index + 1);
        }, currentStageData.duration);
      });
    };

    runStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearTimeout(typeTimer);
    };
  }, [stage]);

  const currentIcon = loadingStages[currentStage]?.icon || Cpu;
  const IconComponent = currentIcon;

  const containerClass = fullscreen 
    ? 'fixed inset-0 bg-background/95 backdrop-blur-sm z-50' 
    : 'relative';

  const centerClass = fullscreen 
    ? 'min-h-screen flex items-center justify-center' 
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={centerClass}>
        <div className="relative max-w-2xl mx-auto text-center">
          {/* Central Glowing Orb */}
          <div className="relative mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-glow-pulse blur-xl"></div>
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-primary opacity-30 animate-glow-pulse flex items-center justify-center">
              <IconComponent className="w-16 h-16 text-primary animate-float" />
            </div>
            
            {/* Rotating rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 rounded-full border border-secondary/20 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          </div>

          {/* Loading Text */}
          <div className="mb-8 h-16 flex items-center justify-center">
            <div className="font-mono text-xl text-primary font-medium">
              {displayText}
              {isTyping && (
                <span className="animate-glow-pulse text-accent ml-1">|</span>
              )}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {loadingStages.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index <= currentStage 
                    ? 'bg-primary shadow-glow' 
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Data Stream Animation */}
          <div className="relative overflow-hidden h-1 bg-surface rounded-full">
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-data-stream"></div>
          </div>

          {/* Matrix Rain Effect (Subtle) */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xs text-primary font-mono animate-matrix-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}