import Header from '@/components/Header';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function VenueLayout({ children }: LayoutProps) {
  return (
    <>
      <Header/>
      {children}
    </>
  );
}
