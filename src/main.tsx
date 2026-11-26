import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function installBrandBadgeFavicon() {
  if (typeof document === 'undefined') return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rounded green square matching top-left sidebar logo box
    const radius = 26;
    ctx.fillStyle = '#14532D';
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    // Crisp white circle container inside green square
    const cx = size / 2;
    const cy = size / 2;
    const circleRadius = 49;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw uploaded colorful logo centered inside the white circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius - 3, 0, Math.PI * 2);
    ctx.clip();
    const pad = 21;
    ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
    ctx.restore();

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  };
  img.src = './assets/aistudio/Logo_with_bg2_784a5e25.png';
}

installBrandBadgeFavicon();

createRoot(document.getElementById('root')!).render(<App />);
