export const themeService = {
  // Toggle between light and dark mode
  toggleTheme: (): boolean => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      return false; // isDark = false
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      return true; // isDark = true
    }
  },

  // Initialize theme based on local storage or system preference
  initTheme: (): boolean => {
    const savedTheme = localStorage.getItem('theme');
    
    // Check local storage first, then system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      return true;
    } else {
      document.documentElement.classList.remove('dark');
      return false;
    }
  },

  // Check current state
  isDark: (): boolean => {
    return document.documentElement.classList.contains('dark');
  }
};