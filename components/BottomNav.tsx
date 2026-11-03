'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

const LINKS = [
  { href: '/', rotulo: '📍 Reportar' },
  { href: '/bairro', rotulo: '📋 Ver Bairro' },
  { href: '/plano', rotulo: '🗺️ Plano' },
  { href: '/como-funciona', rotulo: '📚 Como Funciona' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={styles.item}
          aria-current={pathname === link.href ? 'page' : undefined}
        >
          {link.rotulo}
        </Link>
      ))}
    </nav>
  );
}
