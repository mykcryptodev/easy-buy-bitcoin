import { useState, useEffect } from 'react';

function useAnimatedNumber(endValue: number, duration = 500) {
  const [currentValue, setCurrentValue] = useState(endValue);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = currentValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCurrentValue(startValue + (endValue - startValue) * progress);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCurrentValue(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, duration]);

  return currentValue;
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 2000, formatOptions }) => {
  const animatedValue = useAnimatedNumber(value, duration);

  return (
    <span>
      {animatedValue.toLocaleString([], formatOptions)}
    </span>
  );
};

export default AnimatedNumber;