'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'segmented',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder with same dimensions to prevent layout shift during SSR hydration
    return (
      <div
        className={`h-9 w-24 rounded-lg bg-muted border border-border animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted hover:text-solar transition-colors cursor-pointer ${className}`}
        title={`Current: ${resolvedTheme === 'dark' ? 'Evening Dark' : 'Daylight Light'}. Click to switch theme.`}
        aria-label="Toggle light and dark theme"
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-solar" />
        ) : (
          <Moon className="w-4 h-4 text-foreground" />
        )}
      </button>
    );
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Daylight',
      icon: <Sun className="w-3.5 h-3.5" />,
    },
    {
      value: 'dark',
      label: 'Evening',
      icon: <Moon className="w-3.5 h-3.5" />,
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selector"
      className={`inline-flex items-center h-9 p-0.5 rounded-lg bg-muted border border-border transition-colors ${className}`}
    >
      {options.map((opt) => {
        const isSelected = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.value)}
            className={`h-full px-2.5 inline-flex items-center gap-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              isSelected
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold text-solar'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={`Switch to ${opt.label} mode`}
          >
            {opt.icon}
            <span className="hidden xl:inline text-[11px]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
