import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Dices, Download, Upload, X, Image as ImageIcon, Check } from 'lucide-react';

// --- 1. DYNAMIC ASSET LOADING ---
const rawBase = import.meta.glob('./assets/base/*.{png,jpg,jpeg,webp}', { eager: true });
const rawLegs = import.meta.glob('./assets/legs/*.{png,jpg,jpeg,webp}', { eager: true });
const rawBody = import.meta.glob('./assets/body/*.{png,jpg,jpeg,webp}', { eager: true });
const rawAccessory = import.meta.glob('./assets/accessory/*.{png,jpg,jpeg,webp}', { eager: true });
const rawHead = import.meta.glob('./assets/head/*.{png,jpg,jpeg,webp}', { eager: true });
const rawFace = import.meta.glob('./assets/face/*.{png,jpg,jpeg,webp}', { eager: true });
const rawHand = import.meta.glob('./assets/hand/*.{png,jpg,jpeg,webp}', { eager: true });
const rawBg = import.meta.glob('./assets/bg/*.{png,jpg,jpeg,webp}', { eager: true });

// Helper to clean up filenames
const processAssets = (rawImports) => {
  return Object.entries(rawImports).map(([path, module]) => {
    const filename = path.split('/').pop().split('.')[0];
    const cleanName = filename.replace(/^\d+[_-\s]*/, '').replace(/[_-]/g, ' ');
    const label = cleanName.replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      id: path,
      name: label,
      src: module.default
    };
  });
};

const ASSETS = {
  base: processAssets(rawBase),
  legs: processAssets(rawLegs),
  body: processAssets(rawBody),
  accessory: processAssets(rawAccessory),
  head: processAssets(rawHead),
  face: processAssets(rawFace),
  hand: processAssets(rawHand),
  bg: processAssets(rawBg),
};

// --- CONFIGURATION ---
const CATEGORIES = {
  LEGS: { id: 'legs', label: 'Pants' },
  BODY: { id: 'body', label: 'Body' },
  ACCESSORY: { id: 'accessory', label: 'Accessory' },
  HEAD: { id: 'head', label: 'Head' },
  FACE: { id: 'face', label: 'Face' },
  HAND: { id: 'hand', label: 'Hand' },
  BG: { id: 'bg', label: 'Background' }
};

// --- RENDERER ---
const IvanRenderer = ({ outfit, customImage }) => {
  const baseImage = customImage || (ASSETS.base.length > 0 ? ASSETS.base[0].src : null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 1. Base */}
      {baseImage ? (
        <img src={baseImage} alt="Base" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 opacity-50">
          <ImageIcon size={48} />
          <p className="text-center text-sm mt-2">Add 'ivan.png' to<br/>src/assets/base/</p>
        </div>
      )}

      {/* 2. Face (Expression) - Mandatory */}
      {outfit.face && <img src={outfit.face} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />}

      {/* 3. Legs (Pants) */}
      {outfit.legs && <img src={outfit.legs} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />}
      
      {/* 4. Body (Shirts) */}
      {outfit.body && <img src={outfit.body} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />}
      
      {/* 5. Accessories (Multi-Layer) */}
      {outfit.accessory.map((src) => (
        <img key={src} src={src} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      ))}
      
      {/* 6. Head (Hats) */}
      {outfit.head && <img src={outfit.head} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />}

      {/* 7. Hand */}
      {outfit.hand && <img src={outfit.hand} className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />}
    </div>
  );
};

// --- MAIN APP ---
export default function IvanCustomizer() {
  const [outfit, setOutfit] = useState({
    legs: null,
    body: null,
    accessory: [],
    head: null,
    face: null,
    hand: null,
    bg: null
  });
  
  const [activeCategory, setActiveCategory] = useState('body');
  const [flash, setFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [confettiParticles, setConfettiParticles] = useState([]);

  useEffect(() => {
    if (showConfetti) {
      const particles = [...Array(40)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        color: ['#facc15', '#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 4)],
        duration: `${0.5 + Math.random()}s`,
        delay: `${Math.random() * 0.2}s`
      }));
      setConfettiParticles(particles);
    } else {
      setConfettiParticles([]);
    }
  }, [showConfetti]);

  // --- INITIAL DEFAULTS ---
  useEffect(() => {
    // 1. Mandatory Defaults
    const coolFace = ASSETS.face.find(a => a.name.toLowerCase().includes('cool')) || ASSETS.face[0];
    const schoolBg = ASSETS.bg.find(a => a.name.toLowerCase().includes('school')) || ASSETS.bg[0];

    // 2. Random Start for Clothes
    const randomLegs = ASSETS.legs.length > 0 ? ASSETS.legs[Math.floor(Math.random() * ASSETS.legs.length)].src : null;
    const randomBody = ASSETS.body.length > 0 ? ASSETS.body[Math.floor(Math.random() * ASSETS.body.length)].src : null;

    setOutfit(prev => ({
      ...prev,
      face: coolFace ? coolFace.src : (ASSETS.face[0]?.src || null),
      bg: schoolBg ? schoolBg.src : (ASSETS.bg[0]?.src || null),
      legs: randomLegs,
      body: randomBody
    }));
  }, []);

  const handleEquip = (category, src) => {
    // 1. MANDATORY CATEGORIES CHECK (Face, Legs, Body)
    if (['face', 'legs', 'body'].includes(category)) {
      // If user clicks the currently equipped item, DO NOTHING (prevent unequip)
      if (outfit[category] === src) return;
      // Otherwise, swap to new item
      setOutfit(prev => ({ ...prev, [category]: src }));
      return;
    }

    // 2. ACCESSORY MULTI-SELECT
    if (category === 'accessory') {
      setOutfit(prev => {
        const currentAccessories = prev.accessory;
        if (currentAccessories.includes(src)) {
          return { ...prev, accessory: currentAccessories.filter(item => item !== src) };
        } else {
          return { ...prev, accessory: [...currentAccessories, src] };
        }
      });
      return;
    }

    // 3. STANDARD SINGLE SELECT (Toggle)
    setOutfit(prev => ({
      ...prev,
      [category]: prev[category] === src ? null : src
    }));
  };

  const handleRandomize = () => {
    const newOutfit = { ...outfit };
    
    // Standard Layers
    ['legs', 'body', 'head', 'face', 'hand', 'bg'].forEach(cat => {
      const items = ASSETS[cat];
      if (items.length > 0) {
        // Face, legs, and body are mandatory (100% chance), others have varying chances
        const chance = (cat === 'face' || cat === 'legs' || cat === 'body') ? 1.0 : (cat === 'bg' ? 0.9 : 0.7);
        
        if (Math.random() < chance) {
          newOutfit[cat] = items[Math.floor(Math.random() * items.length)].src;
        } else if (cat !== 'face' && cat !== 'legs' && cat !== 'body') {
          // Don't clear mandatory layers
          newOutfit[cat] = null;
        }
      }
    });

    // Accessories
    const accItems = ASSETS.accessory;
    newOutfit.accessory = [];
    if (accItems.length > 0) {
      if (Math.random() > 0.4) {
        newOutfit.accessory.push(accItems[Math.floor(Math.random() * accItems.length)].src);
        if (Math.random() > 0.7) {
           const secondItem = accItems[Math.floor(Math.random() * accItems.length)].src;
           if (!newOutfit.accessory.includes(secondItem)) newOutfit.accessory.push(secondItem);
        }
      }
    }

    setOutfit(newOutfit);
  };

  const handleReset = () => {
    const coolFace = ASSETS.face.find(a => a.name.toLowerCase().includes('cool')) || ASSETS.face[0];
    const schoolBg = ASSETS.bg.find(a => a.name.toLowerCase().includes('school')) || ASSETS.bg[0];
    const randomLegs = ASSETS.legs.length > 0 ? ASSETS.legs[Math.floor(Math.random() * ASSETS.legs.length)].src : null;
    const randomBody = ASSETS.body.length > 0 ? ASSETS.body[Math.floor(Math.random() * ASSETS.body.length)].src : null;
    
    setOutfit({ 
      legs: randomLegs, body: randomBody, accessory: [], head: null, hand: null,
      face: coolFace ? coolFace.src : (ASSETS.face[0]?.src || null),
      bg: schoolBg ? schoolBg.src : null 
    });
    setCustomImage(null);
  };

  const handleSnapshot = async () => {
    setFlash(true);
    setShowConfetti(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setShowConfetti(false), 2500);

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Order matters: Base -> Face -> Legs -> Body -> Accessories -> Head -> Hand
    const layers = [
      customImage || (ASSETS.base.length > 0 ? ASSETS.base[0].src : null),
      outfit.face,
      outfit.legs,
      outfit.body,
      ...outfit.accessory,
      outfit.head,
      outfit.hand
    ].filter(Boolean);

    try {
      const loadedImages = await Promise.all(layers.map((src, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve({ img, index });
          img.onerror = reject;
          img.src = src;
        });
      }));
      
      loadedImages.sort((a, b) => a.index - b.index);
      loadedImages.forEach(({ img }) => {
        ctx.drawImage(img, 0, 0, 1080, 1920);
      });
      
      const link = document.createElement('a');
      link.download = `ivan-outfit-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate snapshot", err);
      alert("Snapshot complete but auto-download failed. Please check console.");
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const currentBgStyle = outfit.bg 
    ? { backgroundImage: `url(${outfit.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(to bottom, #115e59, #14532d)' };

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-0 md:p-6 font-sans text-slate-100 overflow-hidden">
      
      <div className="w-full max-w-5xl h-full md:h-[80vh] min-h-[600px] bg-slate-800 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700 relative">
        
        {/* CONFETTI LAYER */}
        {showConfetti && (
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {confettiParticles.map((p) => (
              <div
                key={p.id}
                className="absolute w-2 h-2 rounded-full animate-ping opacity-75"
                style={{
                  top: p.top,
                  left: p.left,
                  backgroundColor: p.color,
                  animationDuration: p.duration,
                  animationDelay: p.delay
                }}
              />
            ))}
          </div>
        )}

        {/* MOBILE HEADER BAR */}
        <div className="md:hidden flex justify-between items-center p-3 bg-slate-800 border-b border-slate-700 z-10 shrink-0 shadow-sm w-full">
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-white leading-none tracking-tight">Ivan Customizer</h1>
            <p className="text-[#7FFF00] text-[10px] font-bold uppercase tracking-wider mt-1">Compass High School</p>
          </div>
          <div className="flex items-center gap-1">
             <label className="p-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg cursor-pointer active:scale-95 transition-all">
               <Upload size={16}/>
               <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
             </label>
             <button onClick={handleReset} className="p-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg active:scale-95 transition-all"><RefreshCw size={16}/></button>
             <button onClick={handleSnapshot} className="px-3 py-2 flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg active:scale-95 transition-all shadow-md ml-1">
               <Camera size={16}/>
               <span className="text-xs font-bold">Snap</span>
             </button>
          </div>
        </div>

        {/* LEFT: STAGE */}
        <div 
          className="relative w-full md:w-1/2 h-[42vh] md:h-full transition-all flex items-end justify-center overflow-hidden p-2 md:p-8 shrink-0 border-b md:border-b-0 border-slate-700"
          style={currentBgStyle}
        >
          <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative w-auto h-full aspect-[1080/1920] transition-transform duration-300 hover:scale-[1.02] drop-shadow-2xl">
            <IvanRenderer outfit={outfit} customImage={customImage} />
          </div>

          {/* Quick Randomize floating button on mobile Stage */}
          <div className="md:hidden absolute top-3 right-3 flex gap-2 z-20">
            <button onClick={handleRandomize} className="bg-white/20 backdrop-blur-md p-2.5 rounded-full active:scale-95 border border-white/30 text-white shadow-lg"><Dices size={20} /></button>
          </div>
        </div>

        {/* RIGHT: WARDROBE UI */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-800 flex-1 md:border-l border-slate-700 overflow-hidden">
          
          <div className="hidden md:flex p-6 border-b border-slate-700 justify-between items-center bg-slate-800 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-white">Ivan Customizer</h1>
              <p className="text-[#7FFF00] text-sm font-semibold uppercase tracking-wide mt-1">Compass High School</p>
            </div>
            <div className="flex gap-2">
               <label className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition active:scale-95 flex items-center gap-2" title="Upload Base">
                 <Upload size={18} />
                 <span className="text-sm">Base</span>
                 <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
               </label>
               <button onClick={handleRandomize} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition active:scale-95" title="Randomize"><Dices size={20} /></button>
               <button onClick={handleReset} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition active:scale-95" title="Reset"><RefreshCw size={20} /></button>
               <button onClick={handleSnapshot} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-lg transition active:scale-95 ml-2">
                 <Download size={18} /> <span className="text-sm font-bold">Save</span>
               </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex p-2 md:p-4 gap-2 overflow-x-auto border-b border-slate-700 no-scrollbar shrink-0 bg-slate-800/90 shadow-inner w-full">
            {Object.entries(CATEGORIES).map(([key, catConfig]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(catConfig.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                  activeCategory === catConfig.id 
                    ? 'bg-[#7FFF00] text-slate-900 font-bold shadow-md scale-105' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="capitalize">{catConfig.label}</span>
                {ASSETS[catConfig.id]?.length > 0 && (
                  <span className="bg-black/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold opacity-80 ml-1">
                    {ASSETS[catConfig.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-slate-800 no-scrollbar">
            {ASSETS[activeCategory].length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                <p>No items found in</p>
                <code className="text-xs bg-black/30 p-1 rounded mt-1">src/assets/{activeCategory}/</code>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 pb-12 md:pb-4">
                
                {/* None Button (Hidden for Mandatory Layers and Accessory) */}
                {(activeCategory !== 'accessory' && !['face', 'legs', 'body'].includes(activeCategory)) && (
                  <button
                    onClick={() => handleEquip(activeCategory, null)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transform transition-transform active:scale-95 ${
                      !outfit[activeCategory]
                        ? 'border-2 border-red-400 bg-red-400/10 text-red-300'
                        : 'border-2 border-slate-600 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <X size={24} className={!outfit[activeCategory] ? 'text-red-400 opacity-80' : 'opacity-50'} />
                    <span className="text-[10px] font-bold opacity-80">NONE</span>
                  </button>
                )}

                {ASSETS[activeCategory].map((item) => {
                  const isSelected = activeCategory === 'accessory' 
                    ? outfit.accessory.includes(item.src)
                    : outfit[activeCategory] === item.src;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleEquip(activeCategory, item.src)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2 transition-all relative group overflow-hidden active:scale-95 ${
                        isSelected
                          ? 'bg-slate-700 border-2 border-[#7FFF00] shadow-[0_0_15px_rgba(127,255,0,0.15)] scale-[1.02]' 
                          : 'bg-slate-700 border-2 border-transparent hover:bg-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {/* Checkmark for Multi-Select */}
                      {isSelected && activeCategory === 'accessory' && (
                        <div className="absolute top-1.5 right-1.5 bg-[#7FFF00] rounded-full p-0.5 shadow-md z-10 transition-transform zoom-in">
                          <Check size={10} className="text-slate-900 font-bold" />
                        </div>
                      )}

                      <div className="w-full h-3/4 flex items-center justify-center p-1">
                         <img src={item.src} className="max-w-full max-h-full object-contain drop-shadow-lg transition-transform group-hover:scale-110 duration-300" />
                      </div>
                      
                      <span className={`text-[9px] md:text-xs font-semibold truncate w-full text-center mt-1 pb-1 ${isSelected ? 'text-[#7FFF00]' : 'text-slate-300'}`}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-2 md:p-3 bg-slate-900/80 text-center text-[10px] md:text-xs text-slate-400 shrink-0 font-medium border-t border-slate-700/50">
            Compass High School Navigators
          </div>

        </div>
      </div>
    </div>
  );
}


