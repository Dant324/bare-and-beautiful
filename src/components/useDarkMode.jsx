// src/useDarkMode.js
import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.theme ? localStorage.theme : 'light'
  );

  const colorTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement; 

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (typeof window !== "undefined") {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return [colorTheme, setTheme];
}