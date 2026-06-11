import { cn } from '@/utils/format';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUserStore } from '@/stores/userStore';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const { user, enterprise } = useUserStore();

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Header
        user={user}
        enterpriseName={enterprise?.name || '示例科技有限公司'}
      />
      <Sidebar />
      
      <main
        className={cn(
          'pt-64 pl-240 pr-24 pb-24',
          'transition-all duration-300',
          className
        )}
      >
        <div className="min-w-[1200px] p-24">
          {children}
        </div>
      </main>
    </div>
  );
}