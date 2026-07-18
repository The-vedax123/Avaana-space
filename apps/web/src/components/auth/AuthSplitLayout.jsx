import { Moon, Sun } from 'lucide-react';
import { AuthVisualPanel } from './AuthVisualPanel.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export function AuthSplitLayout({ children }) {
  const { theme, toggle } = useTheme();

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#F7FBFC] dark:bg-brand-900 md:grid md:grid-cols-[45fr_55fr] lg:grid-cols-[58fr_42fr]">
      <AuthVisualPanel />

      <section className="relative z-20 -mt-5 flex min-h-[calc(100svh-200px)] flex-col rounded-t-[1.75rem] bg-[#F7FBFC] text-[#082F3C] dark:bg-brand-900 dark:text-white md:mt-0 md:min-h-[100svh] md:rounded-none">
        <div className="absolute right-5 top-5 z-10 md:right-7 md:top-7">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-10 pt-16 sm:px-10 md:px-8 md:py-16 lg:px-12">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>

        <footer className="px-6 pb-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} AvaanaSpace · Secure access
        </footer>
      </section>
    </main>
  );
}
