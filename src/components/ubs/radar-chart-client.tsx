'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

import type { RadarChartProps } from '@/components/ubs/radar-chart-inner';

const RadarChartInner = dynamic(
  () => import('@/components/ubs/radar-chart-inner').then((mod) => mod.RadarChartInner),
  { ssr: false, loading: () => <Skeleton className="h-[350px] w-full" /> },
);

export { RadarChartInner };
export type { RadarChartProps };
