export interface StepTheme {
  text: string;
  textSoft: string;
  bg: string;
  bgSoft: string;
  border: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  dot: string;
  grad: string;
  badge: string;
  pill: string;
}

export const stepTheme: Record<string, StepTheme> = {
  ST: {
    text: 'text-indigo-600', textSoft: 'text-indigo-400',
    bg: 'bg-indigo-600', bgSoft: 'bg-indigo-50',
    border: 'border-indigo-200', chipBg: 'bg-indigo-50/70', chipBorder: 'border-indigo-200/80',
    chipText: 'text-indigo-900', dot: 'bg-indigo-500',
    grad: 'from-indigo-600 to-blue-500', badge: 'bg-indigo-600', pill: 'hover:border-indigo-300',
  },
  WB: {
    text: 'text-violet-600', textSoft: 'text-violet-400',
    bg: 'bg-violet-600', bgSoft: 'bg-violet-50',
    border: 'border-violet-200', chipBg: 'bg-violet-50/70', chipBorder: 'border-violet-200/80',
    chipText: 'text-violet-900', dot: 'bg-violet-500',
    grad: 'from-violet-600 to-purple-500', badge: 'bg-violet-600', pill: 'hover:border-violet-300',
  },
  CH: {
    text: 'text-rose-600', textSoft: 'text-rose-400',
    bg: 'bg-rose-600', bgSoft: 'bg-rose-50',
    border: 'border-rose-200', chipBg: 'bg-rose-50/70', chipBorder: 'border-rose-200/80',
    chipText: 'text-rose-900', dot: 'bg-rose-500',
    grad: 'from-rose-600 to-red-500', badge: 'bg-rose-600', pill: 'hover:border-rose-300',
  },
  LC: {
    text: 'text-amber-600', textSoft: 'text-amber-400',
    bg: 'bg-amber-500', bgSoft: 'bg-amber-50',
    border: 'border-amber-200', chipBg: 'bg-amber-50/70', chipBorder: 'border-amber-200/80',
    chipText: 'text-amber-900', dot: 'bg-amber-500',
    grad: 'from-amber-500 to-orange-500', badge: 'bg-amber-500', pill: 'hover:border-amber-300',
  },
  TR: {
    text: 'text-emerald-600', textSoft: 'text-emerald-400',
    bg: 'bg-emerald-600', bgSoft: 'bg-emerald-50',
    border: 'border-emerald-200', chipBg: 'bg-emerald-50/70', chipBorder: 'border-emerald-200/80',
    chipText: 'text-emerald-900', dot: 'bg-emerald-500',
    grad: 'from-emerald-600 to-teal-500', badge: 'bg-emerald-600', pill: 'hover:border-emerald-300',
  },
  VO: {
    text: 'text-cyan-600', textSoft: 'text-cyan-400',
    bg: 'bg-cyan-600', bgSoft: 'bg-cyan-50',
    border: 'border-cyan-200', chipBg: 'bg-cyan-50/70', chipBorder: 'border-cyan-200/80',
    chipText: 'text-cyan-900', dot: 'bg-cyan-500',
    grad: 'from-cyan-600 to-sky-500', badge: 'bg-cyan-600', pill: 'hover:border-cyan-300',
  },
  SC: {
    text: 'text-sky-600', textSoft: 'text-sky-400',
    bg: 'bg-sky-600', bgSoft: 'bg-sky-50',
    border: 'border-sky-200', chipBg: 'bg-sky-50/70', chipBorder: 'border-sky-200/80',
    chipText: 'text-sky-900', dot: 'bg-sky-500',
    grad: 'from-sky-600 to-blue-500', badge: 'bg-sky-600', pill: 'hover:border-sky-300',
  },
  SH: {
    text: 'text-fuchsia-600', textSoft: 'text-fuchsia-400',
    bg: 'bg-fuchsia-600', bgSoft: 'bg-fuchsia-50',
    border: 'border-fuchsia-200', chipBg: 'bg-fuchsia-50/70', chipBorder: 'border-fuchsia-200/80',
    chipText: 'text-fuchsia-900', dot: 'bg-fuchsia-500',
    grad: 'from-fuchsia-600 to-pink-500', badge: 'bg-fuchsia-600', pill: 'hover:border-fuchsia-300',
  },
};
