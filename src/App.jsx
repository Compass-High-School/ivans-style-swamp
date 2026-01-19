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
    // 1. MANDATORY FACE CHECK
    if (category === 'face') {
      // If user clicks the currently equipped face, DO NOTHING (prevent unequip)
      if (outfit.face === src) return;
      // Otherwise, swap to new face
      setOutfit(prev => ({ ...prev, face: src }));
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
        // Face is mandatory (100% chance), others have varying chances
        const chance = cat === 'face' ? 1.0 : (cat === 'bg' ? 0.9 : 0.7);
        
        if (Math.random() < chance) {
          newOutfit[cat] = items[Math.floor(Math.random() * items.length)].src;
        } else if (cat !== 'face') {
          // Don't clear face, only others
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
    
    setOutfit({ 
      legs: null, body: null, accessory: [], head: null, hand: null,
      face: coolFace ? coolFace.src : (ASSETS.face[0]?.src || null),
      bg: schoolBg ? schoolBg.src : null 
    });
    setCustomImage(null);
  };

  const handleSnapshot = () => {
    setFlash(true);
    setShowConfetti(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setShowConfetti(false), 2500);
    // Real download logic usually happens here
    alert("Snapshot saved!");
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) setCustomImage(URL.createObjectURL(e.target.files[0]));
  };

  const currentBgStyle = outfit.bg 
    ? { backgroundImage: `url(${outfit.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(to bottom, #115e59, #14532d)' };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 md:p-6 font-sans text-slate-100">
      
      <div className="max-w-5xl w-full bg-slate-800 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700 h-[95vh] md:h-auto relative">
        
        {/* CONFETTI LAYER */}
        {showConfetti && (
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping opacity-75"
                style={{
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  backgroundColor: ['#facc15', '#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 4)],
                  animationDuration: `${0.5 + Math.random()}s`,
                  animationDelay: `${Math.random() * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* LEFT: STAGE */}
        <div 
          className="relative w-full md:w-1/2 h-1/2 md:h-[600px] transition-all duration-500 flex items-end justify-center overflow-hidden p-4 md:p-8 shrink-0"
          style={currentBgStyle}
        >
          <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative w-auto h-full aspect-[1080/1920] transition-transform duration-300 hover:scale-[1.02]">
            <IvanRenderer outfit={outfit} customImage={customImage} />
          </div>

          <div className="md:hidden absolute top-4 right-4 flex gap-2">
            <button onClick={handleRandomize} className="bg-white/20 backdrop-blur-md p-2 rounded-full active:scale-95"><Dices size={20} /></button>
            <button onClick={handleSnapshot} className="bg-white/20 backdrop-blur-md p-2 rounded-full active:scale-95"><Camera size={20} /></button>
          </div>
        </div>

        {/* RIGHT: WARDROBE UI */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-800 h-1/2 md:h-auto border-l border-slate-700">
          
          <div className="hidden md:flex p-6 border-b border-slate-700 justify-between items-center bg-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Ivan Customizer</h1>
              <p className="text-slate-400 text-sm">Compass High School</p>
            </div>
            <div className="flex gap-2">
               <label className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition" title="Upload Base">
                 <Upload size={20} />
                 <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
               </label>
               <button onClick={handleRandomize} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"><Dices size={20} /></button>
               <button onClick={handleReset} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"><RefreshCw size={20} /></button>
               <button onClick={handleSnapshot} className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-lg transition active:scale-95">
                 <Download size={18} /> <span className="text-sm font-bold">Save</span>
               </button>
            </div>
          </div>

          <div className="flex p-3 gap-2 overflow-x-auto border-b border-slate-700 no-scrollbar shrink-0 bg-slate-800">
            {Object.entries(CATEGORIES).map(([key, catConfig]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(catConfig.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm md:text-base ${
                  activeCategory === catConfig.id 
                    ? 'bg-[#7FFF00] text-slate-900 font-bold shadow-lg' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="capitalize">{catConfig.label}</span>
                {ASSETS[catConfig.id]?.length > 0 && (
                  <span className="bg-black/20 px-2 rounded-full text-xs opacity-60 ml-2">
                    {ASSETS[catConfig.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-800">
            {ASSETS[activeCategory].length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                <p>No items found in</p>
                <code className="text-xs bg-black/30 p-1 rounded mt-1">src/assets/{activeCategory}/</code>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
                
                {/* None Button (Hidden for Face + Accessory) */}
                {(activeCategory !== 'accessory' && activeCategory !== 'face') && (
                  <button
                    onClick={() => handleEquip(activeCategory, null)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-slate-600 hover:bg-slate-700 text-slate-400`}
                  >
                    <X size={24} />
                    <span className="text-[10px]">None</span>
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
                      className={`aspect-square rounded-xl flex flex-col items-center justify-between p-2 transition-all relative group overflow-hidden ${
                        isSelected
                          ? 'bg-slate-700 border-2 border-[#7FFF00] shadow-lg' 
                          : 'bg-slate-700 border-2 border-transparent hover:bg-slate-600'
                      }`}
                    >
                      {/* Checkmark for Multi-Select */}
                      {isSelected && activeCategory === 'accessory' && (
                        <div className="absolute top-2 right-2 bg-[#7FFF00] rounded-full p-1 shadow-md z-10">
                          <Check size={12} className="text-slate-900" />
                        </div>
                      )}

                      <div className="w-full h-2/3 flex items-center justify-center">
                         <img src={item.src} className="max-w-full max-h-full object-contain drop-shadow-md" />
                      </div>
                      
                      <span className={`text-[10px] md:text-xs font-medium truncate w-full text-center ${isSelected ? 'text-[#7FFF00]' : 'text-slate-300'}`}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-900/50 text-center text-[10px] md:text-xs text-slate-500 shrink-0">
            Compass High School • Go Navigators!
          </div>

        </div>
      </div>
    </div>
  );
}


