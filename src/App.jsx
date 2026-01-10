import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Dices, Download, Share2, Upload, Image as ImageIcon, X, PartyPopper } from 'lucide-react';

// --- GRAPHICS ENGINE ---

const IvanBase = ({ expression, customImage }) => {
  // 1. If user uploaded a custom base, show that instead of SVG
  if (customImage) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img src={customImage} alt="Custom Ivan" className="max-h-full max-w-full object-contain drop-shadow-2xl" />
      </div>
    );
  }

  // --- STYLE CONFIG ---
  const gatorBody = "#4ade80"; // Friendly Bright Green
  const gatorStroke = "#14532d"; // Forest Green Stroke
  const bellyColor = "#dcfce7"; // Very pale green for contrast

  // 2. Default Improved Mascot SVG
  // UPDATED EXPRESSION COORDINATES (Moved down ~25px)
  const expressions = {
    happy: <path d="M75 125 Q 95 140 115 125" stroke={gatorStroke} strokeWidth="4" fill="none" strokeLinecap="round" />,
    cool: <path d="M80 130 Q 95 125 110 130" stroke={gatorStroke} strokeWidth="4" fill="none" />,
    surprised: (
      <circle cx="95" cy="130" r="8" fill={gatorStroke} />
    ),
    silly: (
      <g>
        <path d="M75 125 Q 95 140 115 125" stroke={gatorStroke} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M85 135 Q 95 155 105 135" fill="#ef4444" />
      </g>
    ),
    grumpy: (
      <path d="M75 135 Q 95 120 115 135" stroke={gatorStroke} strokeWidth="4" fill="none" strokeLinecap="round" />
    )
  };

  return (
    <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
      
      {/* TAIL: Sitting on the ground - Thinner & Smaller */}
      <path d="M95 225 Q 135 255 170 285" stroke={gatorBody} strokeWidth="25" fill="none" strokeLinecap="round" />
      {/* Tail Outline/Accent - Thinner */}
      <path d="M95 245 Q 135 275 170 305" stroke={gatorStroke} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" /> 
      {/* Tail Ridges - Adjusted for thinner tail */}
      <path d="M115 235 L 122 228 L 129 240 M 135 248 L 142 241 L 149 253 M 155 261 L 162 254 L 169 266" stroke={gatorStroke} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* LEGS - Longer and thinner */}
      <path d="M85 250 L 80 290" stroke={gatorBody} strokeWidth="25" strokeLinecap="round" />
      <path d="M115 250 L 120 290" stroke={gatorBody} strokeWidth="25" strokeLinecap="round" />
      <ellipse cx="80" cy="295" rx="15" ry="8" fill={gatorStroke} /> {/* Feet */}
      <ellipse cx="120" cy="295" rx="15" ry="8" fill={gatorStroke} />

      {/* BODY - Taller and Thinner */}
      <ellipse cx="100" cy="170" rx="45" ry="100" fill={gatorBody} stroke={gatorStroke} strokeWidth="3" />
      
      {/* BELLY - Thinner */}
      <path d="M75 140 Q 100 280 125 140" fill={bellyColor} /> 
      <path d="M75 140 Q 100 120 125 140" fill={bellyColor} />

      {/* ARMS - Adjusted positions */}
      <path d="M55 150 Q 40 180 50 210" stroke={gatorBody} strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M145 150 Q 160 180 150 210" stroke={gatorBody} strokeWidth="20" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="215" r="10" fill={gatorBody} stroke={gatorStroke} strokeWidth="2" /> {/* Hand L */}
      <circle cx="150" cy="215" r="10" fill={gatorBody} stroke={gatorStroke} strokeWidth="2" /> {/* Hand R */}

      {/* HEAD BASE (Behind Snout) - Thinner */}
      <path d="M60 80 Q 60 30 100 30 T 140 80" fill={gatorBody} stroke={gatorStroke} strokeWidth="3" /> 
      
      {/* SNOUT - Thinner */}
      <path d="M65 90 Q 65 135 100 135 Q 135 135 135 90 Z" fill={gatorBody} stroke={gatorStroke} strokeWidth="3" />
      
      {/* EYES - Adjusted position */}
      <circle cx="80" cy="65" r="12" fill="white" stroke={gatorStroke} strokeWidth="2" />
      <circle cx="120" cy="65" r="12" fill="white" stroke={gatorStroke} strokeWidth="2" />
      
      {/* PUPILS */}
      {expression !== 'silly' && (
        <g>
          <circle cx="80" cy="65" r="5" fill="black" />
          <circle cx="120" cy="65" r="5" fill="black" />
        </g>
      )}
      {expression === 'silly' && (
        <g>
          <circle cx="80" cy="65" r="5" fill="black" />
          <line x1="110" y1="65" x2="130" y2="65" stroke={gatorStroke} strokeWidth="3" /> {/* Wink */}
        </g>
      )}

      {/* NOSTRILS - Moved down & adjusted position */}
      <circle cx="90" cy="115" r="3" fill={gatorStroke} opacity="0.6" />
      <circle cx="110" cy="115" r="3" fill={gatorStroke} opacity="0.6" />

      {/* EXPRESSION - Moved down */}
      {expressions[expression] || expressions.happy}

    </svg>
  );
};

// --- ACCESSORIES ---

const TopHat = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <rect x="70" y="5" width="60" height="50" fill="#1e293b" />
    <rect x="60" y="50" width="80" height="10" rx="2" fill="#1e293b" />
    <rect x="70" y="40" width="60" height="10" fill="#ef4444" />
  </svg>
);

const SpaceHelmet = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <circle cx="95" cy="75" r="60" fill="rgba(147, 197, 253, 0.3)" stroke="#60a5fa" strokeWidth="3" />
    <path d="M95 15 L 95 5" stroke="#94a3b8" strokeWidth="3" />
    <circle cx="95" cy="5" r="4" fill="#ef4444" className="animate-pulse" />
  </svg>
);

const GradCap = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M60 30 L 100 10 L 140 30 L 100 50 Z" fill="#73C2FB" stroke="#1e293b" strokeWidth="2" />
    <rect x="65" y="30" width="70" height="20" fill="#73C2FB" />
    <line x1="140" y1="30" x2="140" y2="70" stroke="#7FFF00" strokeWidth="3" />
    <circle cx="140" cy="70" r="3" fill="#7FFF00" />
  </svg>
);

const PropellerCap = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M65 40 Q 100 10 135 40" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
    <rect x="98" y="10" width="4" height="10" fill="#ef4444" />
    <ellipse cx="100" cy="10" rx="25" ry="5" fill="#facc15" className="animate-spin-slow origin-center" />
  </svg>
);

const CHSJersey = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M65 140 L 135 140 L 135 250 L 65 250 Z" fill="#73C2FB" />
    <path d="M65 140 L 40 170 L 55 185 L 70 155" fill="#73C2FB" /> {/* Sleeve L */}
    <path d="M135 140 L 160 170 L 145 185 L 130 155" fill="#73C2FB" /> {/* Sleeve R */}
    <text x="100" y="200" textAnchor="middle" fill="#7FFF00" fontSize="36" fontWeight="bold" fontFamily="sans-serif">CHS</text>
    <path d="M85 140 Q 100 160 115 140" fill="#1e293b" opacity="0.3" />
  </svg>
);

const Tuxedo = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M65 140 L 135 140 L 135 250 L 65 250 Z" fill="#1e293b" />
    <path d="M100 140 L 100 250" stroke="white" strokeWidth="25" />
    <polygon points="100,150 85,140 115,140" fill="#ef4444" />
    <polygon points="100,150 85,160 115,160" fill="#ef4444" />
  </svg>
);

const Scarf = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M70 135 Q 100 155 130 135" stroke="#73C2FB" strokeWidth="18" fill="none" strokeLinecap="round" />
    <path d="M115 135 L 125 180" stroke="#7FFF00" strokeWidth="14" fill="none" strokeLinecap="round" />
    <path d="M70 135 Q 100 155 130 135" stroke="#73C2FB" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="5,10" />
  </svg>
);

const Shades = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <rect x="70" y="58" width="25" height="15" fill="black" rx="4" />
    <rect x="105" y="58" width="25" height="15" fill="black" rx="4" />
    <line x1="95" y1="65" x2="105" y2="65" stroke="black" strokeWidth="3" />
    <line x1="70" y1="65" x2="55" y2="62" stroke="black" strokeWidth="3" />
    <line x1="130" y1="65" x2="145" y2="62" stroke="black" strokeWidth="3" />
  </svg>
);

const Monocle = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <circle cx="120" cy="65" r="14" fill="rgba(255,255,255,0.2)" stroke="#facc15" strokeWidth="3" />
    <path d="M134 65 Q 138 65 138 100" stroke="#facc15" strokeWidth="2" fill="none" />
  </svg>
);

const Pizza = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <path d="M30 190 L 65 220 L 35 235 Z" fill="#eab308" stroke="#b45309" strokeWidth="2" />
    <path d="M30 190 Q 25 210 35 235" fill="#b45309" />
    <circle cx="45" cy="210" r="4" fill="#ef4444" />
    <circle cx="50" cy="200" r="3" fill="#ef4444" />
  </svg>
);

const Compass = () => (
  <svg viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
    <circle cx="50" cy="215" r="20" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
    <circle cx="50" cy="215" r="16" fill="white" />
    <path d="M50 205 L 55 215 L 50 225 L 45 215 Z" fill="#ef4444" />
  </svg>
);

// --- ASSET CONFIGURATION ---

const CATEGORIES = {
  MOOD: 'mood',
  HEAD: 'head',
  BODY: 'body',
  FACE: 'face',
  HAND: 'hand',
  BG: 'background'
};

const ASSETS = {
  [CATEGORIES.MOOD]: [
    { id: 'happy', name: 'Happy', emoji: '😀' },
    { id: 'cool', name: 'Cool', emoji: '😎' },
    { id: 'surprised', name: 'Shocked', emoji: '😮' },
    { id: 'silly', name: 'Silly', emoji: '😜' },
    { id: 'grumpy', name: 'Grumpy', emoji: '😠' },
  ],
  [CATEGORIES.HEAD]: [
    { id: 'none', name: 'None', emoji: '🚫', component: null },
    { id: 'tophat', name: 'Gentleman', emoji: '🎩', component: TopHat },
    { id: 'gradcap', name: 'Class of \'24', emoji: '🎓', component: GradCap },
    { id: 'propeller', name: 'Recess', emoji: '🚁', component: PropellerCap },
    { id: 'space', name: 'Space Cadet', emoji: '🧑‍🚀', component: SpaceHelmet },
  ],
  [CATEGORIES.BODY]: [
    { id: 'none', name: 'Au Naturel', emoji: '🚫', component: null },
    { id: 'jersey', name: 'CHS Spirit', emoji: '👕', component: CHSJersey },
    { id: 'tuxedo', name: 'Prom Night', emoji: '🤵', component: Tuxedo },
    { id: 'scarf', name: 'Winter', emoji: '🧣', component: Scarf },
  ],
  [CATEGORIES.FACE]: [
    { id: 'none', name: 'None', emoji: '🚫', component: null },
    { id: 'shades', name: 'Cool Gator', emoji: '🕶️', component: Shades },
    { id: 'monocle', name: 'Fancy', emoji: '🧐', component: Monocle },
  ],
  [CATEGORIES.HAND]: [
    { id: 'none', name: 'Empty', emoji: '🚫', component: null },
    { id: 'compass', name: 'Navigator', emoji: '🧭', component: Compass },
    { id: 'pizza', name: 'Snack', emoji: '🍕', component: Pizza },
  ],
  [CATEGORIES.BG]: [
    { id: 'swamp', name: 'The Bayou', emoji: '🐊', color: 'bg-gradient-to-b from-teal-800 to-green-900' },
    { id: 'school', name: 'Compass High', emoji: '🏫', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
    { id: 'disco', name: 'Prom', emoji: '💃', color: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600 via-pink-600 to-orange-500 animate-pulse' },
    { id: 'studio', name: 'Studio', emoji: '🎨', color: 'bg-gray-100' },
  ]
};

// --- SUB-COMPONENTS ---

const IvanRenderer = ({ outfit, customImage }) => {
  return (
    <div className="relative w-full h-full">
      <IvanBase expression={outfit.mood} customImage={customImage} />
      {/* Clothing Layers */}
      {ASSETS[CATEGORIES.BODY].find(i => i.id === outfit.body)?.component && React.createElement(ASSETS[CATEGORIES.BODY].find(i => i.id === outfit.body).component)}
      {ASSETS[CATEGORIES.HEAD].find(i => i.id === outfit.head)?.component && React.createElement(ASSETS[CATEGORIES.HEAD].find(i => i.id === outfit.head).component)}
      {ASSETS[CATEGORIES.FACE].find(i => i.id === outfit.face)?.component && React.createElement(ASSETS[CATEGORIES.FACE].find(i => i.id === outfit.face).component)}
      {ASSETS[CATEGORIES.HAND].find(i => i.id === outfit.hand)?.component && React.createElement(ASSETS[CATEGORIES.HAND].find(i => i.id === outfit.hand).component)}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function IvanCustomizer() {
  const [outfit, setOutfit] = useState({
    mood: 'happy',
    head: 'none',
    body: 'none',
    face: 'none',
    hand: 'none',
    bg: 'swamp'
  });
  
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.HEAD);
  const [flash, setFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleEquip = (category, itemId) => {
    setOutfit(prev => ({ ...prev, [category]: itemId }));
  };

  const handleRandomize = () => {
    const newOutfit = { ...outfit };
    Object.keys(CATEGORIES).forEach(key => {
      const category = CATEGORIES[key];
      const items = ASSETS[category];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      newOutfit[category] = randomItem.id;
    });
    setOutfit(newOutfit);
  };

  const handleReset = () => {
    setOutfit({ mood: 'happy', head: 'none', body: 'none', face: 'none', hand: 'none', bg: 'swamp' });
    setCustomImage(null);
  };

  const handleSnapshot = () => {
    setFlash(true);
    setShowConfetti(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setShowConfetti(false), 2000); // Hide confetti after 2s
    setTimeout(() => alert("Saved! In the full version, this downloads your creation."), 300);
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  const currentBgClass = ASSETS[CATEGORIES.BG].find(b => b.id === outfit.bg)?.color || 'bg-gray-200';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 md:p-6 font-sans text-slate-100">
      
      {/* App Container */}
      <div className="max-w-5xl w-full bg-slate-800 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700 h-[95vh] md:h-auto relative">
        
        {/* Confetti Overlay */}
        {showConfetti && (
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#facc15', '#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        )}

        {/* LEFT: The Stage (Ivan) */}
        <div className={`relative w-full md:w-1/2 h-1/2 md:h-[600px] ${currentBgClass} transition-colors duration-500 flex items-end justify-center overflow-hidden p-4 md:p-8 shrink-0`}>
          
          {/* Flash Effect */}
          <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />

          {/* Dynamic BG Decor */}
          {outfit.bg === 'swamp' && (
            <>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-900 rounded-tr-full opacity-60" />
              <div className="absolute bottom-10 right-10 w-16 h-4 bg-green-950 rounded-full opacity-40 animate-pulse" />
            </>
          )}
          {outfit.bg === 'school' && <div className="absolute top-10 font-bold text-white/20 text-6xl select-none animate-bounce">CHS</div>}

          {/* The Gator */}
          <div className="relative w-auto h-full aspect-[2/3] transition-transform duration-300 hover:scale-105">
            <IvanRenderer outfit={outfit} customImage={customImage} />
          </div>

          {/* Upload Button (Overlay on Stage - Mobile) */}
          <div className="md:hidden absolute top-4 left-4 z-10">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
             {customImage ? (
                <button onClick={() => setCustomImage(null)} className="flex items-center gap-2 bg-red-500/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-red-600 transition">
                  <X size={14} /> Remove Custom Base
                </button>
             ) : (
                <button onClick={triggerUpload} className="flex items-center gap-2 bg-black/40 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-black/60 transition border border-white/20">
                  <Upload size={14} /> Upload Custom Base
                </button>
             )}
          </div>

          {/* Mobile Actions Overlay */}
          <div className="md:hidden absolute top-4 right-4 flex gap-2">
            <button onClick={handleRandomize} className="bg-white/20 backdrop-blur-md p-2 rounded-full active:scale-95"><Dices size={20} /></button>
            <button onClick={handleSnapshot} className="bg-white/20 backdrop-blur-md p-2 rounded-full active:scale-95"><Camera size={20} /></button>
          </div>
        </div>

        {/* RIGHT: The Wardrobe (UI) */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-800 h-1/2 md:h-auto">
          
          {/* Header (Desktop) */}
          <div className="hidden md:flex p-6 border-b border-slate-700 justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Ivan Customizer</h1>
              <p className="text-slate-400 text-sm">Compass High School Edition</p>
            </div>
            <div className="flex gap-2">
               {/* Desktop Upload Button */}
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
               {customImage ? (
                 <button onClick={() => setCustomImage(null)} className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition" title="Remove Custom Base"><X size={20} /></button>
               ) : (
                 <button onClick={triggerUpload} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition" title="Upload Custom Base"><Upload size={20} /></button>
               )}
               
               <button onClick={handleRandomize} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition" title="Shuffle"><Dices size={20} /></button>
               <button onClick={handleReset} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition" title="Reset"><RefreshCw size={20} /></button>
               <button onClick={handleSnapshot} className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-lg transition active:scale-95" title="Download">
                 <Download size={18} /> <span className="text-sm font-bold">Save</span>
               </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex p-3 gap-2 overflow-x-auto border-b border-slate-700 no-scrollbar shrink-0">
            {/* ... existing code ... */}
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm md:text-base ${
                  activeCategory === value 
                    ? 'bg-[#7FFF00] text-slate-900 font-bold shadow-[0_0_10px_rgba(127,255,0,0.3)]' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="capitalize">{value === 'bg' ? 'Background' : value}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
              {ASSETS[activeCategory].map((item) => {
                const isSelected = outfit[activeCategory === CATEGORIES.BG ? 'bg' : activeCategory] === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(activeCategory === CATEGORIES.BG ? 'bg' : activeCategory, item.id)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-600 border-2 border-[#7FFF00] shadow-lg' 
                        : 'bg-slate-700 border-2 border-transparent hover:bg-slate-600'
                    }`}
                  >
                    {/* Render Color preview for BG, or Emoji for Items */}
                    {activeCategory === CATEGORIES.BG ? (
                      <>
                        <div className={`absolute inset-0 ${item.color} opacity-80`} />
                        <span className="relative z-10 text-3xl drop-shadow-md">{item.emoji}</span>
                      </>
                    ) : (
                      <span className="text-4xl md:text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </span>
                    )}
                    
                    <span className={`text-[10px] md:text-xs font-medium z-10 ${activeCategory === CATEGORIES.BG ? 'text-white drop-shadow-md' : 'text-slate-300'}`}>
                      {item.name}
                    </span>
                    
                    {/* Selection Indicator Dot */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#7FFF00] rounded-full shadow-[0_0_5px_#7FFF00]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-slate-900/50 text-center text-[10px] md:text-xs text-slate-500 shrink-0">
            Compass High School • Go Navigators!
          </div>

        </div>
      </div>
    </div>
  );
}