import { useEffect, useState } from 'react';
import { Card } from './ui/card';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 justify-center">
      <Card className="flex flex-col items-center p-2 min-w-[60px] bg-background/50 backdrop-blur-sm border border-muted/50">
        <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
        <span className="text-xs text-muted-foreground">dias</span>
      </Card>
      <Card className="flex flex-col items-center p-2 min-w-[60px] bg-background/50 backdrop-blur-sm border border-muted/50">
        <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
        <span className="text-xs text-muted-foreground">horas</span>
      </Card>
      <Card className="flex flex-col items-center p-2 min-w-[60px] bg-background/50 backdrop-blur-sm border border-muted/50">
        <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
        <span className="text-xs text-muted-foreground">min</span>
      </Card>
      <Card className="flex flex-col items-center p-2 min-w-[60px] bg-background/50 backdrop-blur-sm border border-muted/50">
        <span className="text-2xl font-bold text-primary">{timeLeft.seconds}</span>
        <span className="text-xs text-muted-foreground">seg</span>
      </Card>
    </div>
  );
} 