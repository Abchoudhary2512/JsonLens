"use client";

import dynamic from 'next/dynamic';

export const ThemeToggleWrapper = dynamic(
  () => import('@/components/theme-toggle').then((mod) => mod.ThemeToggle),
  { ssr: false }
);