import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: LayoutProps) => (
  <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
);

export const Header = ({ children, className }: LayoutProps) => (
  <header className={cn('bg-white shadow-sm border-b border-gray-200', className)}>
    <Container>
      <div className="py-4">
        {children}
      </div>
    </Container>
  </header>
);

export const Main = ({ children, className }: LayoutProps) => (
  <main className={cn('min-h-screen bg-gray-50', className)}>
    <Container className="py-8">
      {children}
    </Container>
  </main>
);

export const Grid = ({ 
  children, 
  cols = 1, 
  gap = 4, 
  className 
}: { 
  children: ReactNode; 
  cols?: 1 | 2 | 3 | 4 | 5 | 6; 
  gap?: 2 | 4 | 6 | 8; 
  className?: string; 
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const gapClass = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={cn('grid', colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  );
};
