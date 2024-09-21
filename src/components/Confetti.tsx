import { type FC, useEffect, useMemo, useCallback } from "react";
import { useConfetti } from "use-confetti-svg";

const bitcoinImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBjb2xvcj0iI2ZmOTkwMCIgZmlsbD0ibm9uZSI+CiAgICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiAvPgogICAgPHBhdGggZD0iTTkuNSAxNkw5LjUgOCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CiAgICA8cGF0aCBkPSJNMTEgOFY2TTEzLjUgOFY2IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KICAgIDxwYXRoIGQ9Ik0xMSAxOFYxNk0xMy41IDE4VjE2IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KICAgIDxwYXRoIGQ9Ik05LjUgMTJIMTQuNUMxNS4zMjg0IDEyIDE2IDEyLjY3MTYgMTYgMTMuNVYxNC41QzE2IDE1LjMyODQgMTUuMzI4NCAxNiAxNC41IDE2SDgiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiAvPgogICAgPHBhdGggZD0iTTggOEwxNC41IDhDMTUuMzI4NCA4IDE2IDguNjcxNTcgMTYgOS41VjEwLjVDMTYgMTEuMzI4NCAxNS4zMjg0IDEyIDE0LjUgMTJIOS41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgLz4KPC9zdmc+';
const usdcImage = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBjb2xvcj0iIzI3NzVjYSIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBkPSJNMjIgMTJDMjIgMTcuNTIyOCAxNy41MjI4IDIyIDEyIDIyQzYuNDc3MTUgMjIgMiAxNy41MjI4IDIgMTJDMiA2LjQ3NzE1IDYuNDc3MTUgMiAxMiAyQzE3LjUyMjggMiAyMiA2LjQ3NzE1IDIyIDEyWiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMS41IiAvPgogICAgPHBhdGggZD0iTTE0LjcxMDIgMTAuMDYxMUMxNC42MTExIDkuMjk4NDQgMTMuNzM1NCA4LjA2NjIyIDEyLjE2MDggOC4wNjYxOUMxMC4zMzEyIDguMDY2MTYgOS41NjEzNiA5LjA3OTQ2IDkuNDA1MTUgOS41ODYxMUM5LjE2MTQ1IDEwLjI2MzggOS4yMTAxOSAxMS42NTcxIDExLjM1NDcgMTEuODA5QzE0LjAzNTQgMTEuOTk5IDE1LjEwOTMgMTIuMzE1NCAxNC45NzI3IDEzLjk1NkMxNC44MzYgMTUuNTk2NSAxMy4zNDE3IDE1Ljk1MSAxMi4xNjA4IDE1LjkxMjlDMTAuOTc5OCAxNS44NzUgOS4wNDc2NCAxNS4zMzI1IDguOTcyNjYgMTMuODczM00xMS45NzM0IDYuOTk4MDVWOC4wNjk4Mk0xMS45NzM0IDE1LjkwMzFWMTYuOTk4IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9zdmc+';

type Props = {
  image: 'bitcoin' | 'usdc';
}

export const Confetti: FC<Props> = ({ image }) => {
  const confettiConfig = useMemo(() => ({
    images: [16, 32, 64].map(size => ({
      src: `data:image/svg+xml;base64,${image === 'bitcoin' ? bitcoinImage : usdcImage}`,
      size,
      weight: size === 32 ? 20 : 10, // Give medium size more weight
    })),
    duration: 6000,
    fadeOut: 500,
    particleCount: 50,
    speed: 50,
    rotate: true
  }), [image]);

  const { runAnimation } = useConfetti(confettiConfig);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #confetti-canvas {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: -1 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void runAnimation();
    }, 300);

    return () => clearTimeout(timer);
  }, [runAnimation]);

  return (
    <div />
  );
};

export default Confetti;