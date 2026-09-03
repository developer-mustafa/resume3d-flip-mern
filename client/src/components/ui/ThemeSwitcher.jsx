import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import useThemeStore from '../../stores/themeStore';

const themes = [
  { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
  { id: 'cyan', name: 'Cyan', color: 'bg-cyan-500' },
  { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500' },
];

export default function ThemeSwitcher({ className = '', placement = 'bottom' }) {
  const { mode, theme, toggleMode, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let dropdownPositionClass = 'top-12 mt-2 right-0';
  if (placement === 'top') dropdownPositionClass = 'bottom-12 mb-2 right-0';
  if (placement === 'right') dropdownPositionClass = 'left-12 ml-4 top-0';

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleMode}
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle Dark Mode"
      >
        {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        aria-label="Choose Theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className={`absolute ${dropdownPositionClass} w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-slide-in`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-2">Select Theme</p>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                title={t.name}
                className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center transform hover:scale-110 transition-transform ${
                  theme === t.id ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white dark:ring-offset-slate-900' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
