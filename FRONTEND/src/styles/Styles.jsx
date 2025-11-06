export const modernStyles = `
  .ultra-modern-bg {
   // background: linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%);
    min-height: 100vh;
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
    border-radius: 24px;
  }
  
  .glass-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border-radius: 20px;
  }
  
  .section-divider {
    background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%);
    height: 1px;
    margin: 2rem 0;
  }
  
  .modern-input {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 16px 20px;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  
  .modern-input:focus {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
  
  .modern-textarea {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 16px 20px;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    resize: none;
  }
  
  .modern-textarea:focus {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: rgba(255, 255, 255, 1);
  }
  
  .modern-slider::-webkit-slider-thumb {
    appearance: none;
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
  }
  
  .modern-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
  }
  
  .modern-slider::-moz-range-thumb {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }
  
  .symptom-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 20px;
    padding: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  
  .symptom-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }
  
  .symptom-card.selected {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.2) 100%);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
  }
  
  .tooth {
    cursor: pointer;
    transition: none;
    filter: drop-shadow(0 2px 8px rgba(30, 64, 175, 0.15));
    transform-origin: center;
  }
  
  .tooth:hover {
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
  }
  
  .tooth.selected {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 35px rgba(59, 130, 246, 0.4));
  }
  
  .tooth-number {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 10px;
    fill: #1e293b;
    text-anchor: middle;
    dominant-baseline: central;
    pointer-events: none;
    transition: none;
  }
  
  .tooth.selected .tooth-number {
    fill: white;
    font-size: 11px;
    font-weight: 800;
  }
  
  .quadrant-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 12px;
    fill: #4338ca;
    text-anchor: middle;
  }
  
  .diagram-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(59, 130, 246, 0.1);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }
  
  .modern-button {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }
  
  .modern-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }
  
  .modern-button-outline {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(59, 130, 246, 0.2);
    border-radius: 16px;
    padding: 16px 32px;
    color: #3b82f6;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }
  
  .modern-button-outline:hover {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(255, 255, 255, 0.9);
     color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
  
  .floating-header {
    position: sticky;
    top: 20px;
    z-index: 50;
  }
  
  .section-title {
    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  .subsection-title {
    background: linear-gradient(135deg, #475569 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    align-item: center;
  }
`;

