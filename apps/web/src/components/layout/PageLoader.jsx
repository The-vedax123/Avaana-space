import { LogoMark } from '../ui/Logo.jsx';

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <LogoMark size={48} />
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_infinite] bg-brand-gradient" />
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
