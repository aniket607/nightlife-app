'use client'
import { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
interface LayoutProps {
    children: ReactNode;
  }
export default function VenueLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
