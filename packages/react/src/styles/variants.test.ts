import { describe, expect, it } from 'vitest';
import { cn } from './cn';
import { defineVariants, defineSlots, splitVariantProps } from './variants';

describe('cn', () => {
  it('resolves conflicting Tailwind utilities in favour of the last one', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
    expect(cn('bg-red-500 text-white', 'bg-blue-500')).toBe('text-white bg-blue-500');
  });

  it('keeps non-conflicting utilities', () => {
    expect(cn('flex items-center', 'gap-2')).toBe('flex items-center gap-2');
  });

  it('treats the custom shadow group as conflicting with Tailwind shadows', () => {
    // Without the `extendTailwindMerge` config in cn.ts both classes survive
    // and CSS source order silently decides the winner.
    expect(cn('shadow-overlay', 'shadow-none')).toBe('shadow-none');
    expect(cn('shadow-lg', 'shadow-overlay')).toBe('shadow-overlay');
  });

  it('resolves every custom token group registered in cn.ts', () => {
    // Each of these would keep *both* classes if the corresponding group were
    // missing from `extendTailwindMerge`, because twMerge validates these
    // utilities against Tailwind's own scales and our token names are not in
    // them. Source order would then decide the winner instead of the consumer.
    expect(cn('rounded-control', 'rounded-full')).toBe('rounded-full');
    expect(cn('rounded-full', 'rounded-control')).toBe('rounded-control');
    expect(cn('rounded-surface', 'rounded-none')).toBe('rounded-none');
    expect(cn('duration-fast', 'duration-500')).toBe('duration-500');
    expect(cn('ease-editorial', 'ease-linear')).toBe('ease-linear');
    expect(cn('text-title', 'text-body')).toBe('text-body');
  });

  it('ignores falsy values', () => {
    expect(cn('flex', false, null, undefined, '')).toBe('flex');
  });
});

describe('defineVariants', () => {
  const button = defineVariants({
    base: 'inline-flex rounded-md',
    variants: {
      variant: { primary: 'bg-accent text-accent-fg', ghost: 'bg-transparent' },
      size: { sm: 'h-8 px-3', md: 'h-10 px-4' },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
    compoundVariants: [{ variant: 'ghost', size: 'sm', class: 'px-2' }],
  });

  it('applies default variants', () => {
    expect(button()).toBe('inline-flex rounded-md bg-accent text-accent-fg h-10 px-4');
  });

  it('lets an explicit variant override the default', () => {
    expect(button({ size: 'sm' })).toContain('h-8 px-3');
    expect(button({ size: 'sm' })).not.toContain('h-10');
  });

  it('supports boolean variants', () => {
    expect(button({ fullWidth: true })).toContain('w-full');
    expect(button({ fullWidth: false })).not.toContain('w-full');
  });

  it('applies a compound variant only when every condition matches', () => {
    // `px-2` from the compound variant must beat `px-3` from `size: sm`,
    // which only works because compounds are appended last and run through twMerge.
    expect(button({ variant: 'ghost', size: 'sm' })).toContain('px-2');
    expect(button({ variant: 'ghost', size: 'sm' })).not.toContain('px-3');
    expect(button({ variant: 'primary', size: 'sm' })).toContain('px-3');
  });

  it('appends and merges the `class` escape hatch last', () => {
    expect(button({ class: 'px-8' })).toContain('px-8');
    expect(button({ class: 'px-8' })).not.toContain('px-4');
  });

  it('exposes its variant keys', () => {
    expect(button.variantKeys).toEqual(['variant', 'size', 'fullWidth']);
  });
});

describe('defineSlots', () => {
  const toggle = defineSlots({
    slots: { root: 'relative rounded-full', thumb: 'block bg-white' },
    variants: {
      size: {
        sm: { root: 'h-5 w-9', thumb: 'size-4' },
        lg: { root: 'h-7 w-13', thumb: 'size-6' },
      },
      variant: {
        primary: { root: 'data-checked:bg-accent' },
      },
    },
    defaultVariants: { size: 'sm', variant: 'primary' },
    compoundVariants: [{ size: 'lg', variant: 'primary', class: { thumb: 'shadow-md' } }],
  });

  it('drives every slot from one variant selection', () => {
    expect(toggle.root({ size: 'lg' })).toContain('h-7 w-13');
    expect(toggle.thumb({ size: 'lg' })).toContain('size-6');
  });

  it('only emits classes for slots a variant actually declares', () => {
    // `variant` says nothing about the thumb, so the thumb must be unaffected.
    expect(toggle.thumb({ variant: 'primary' })).toBe('block bg-white size-4');
  });

  it('applies compound variants per slot', () => {
    expect(toggle.thumb({ size: 'lg', variant: 'primary' })).toContain('shadow-md');
    expect(toggle.thumb({ size: 'sm', variant: 'primary' })).not.toContain('shadow-md');
  });

  it('shares variant keys across slots', () => {
    expect(toggle.variantKeys).toEqual(['size', 'variant']);
  });
});

describe('splitVariantProps', () => {
  it('separates variant props from element props', () => {
    const [variants, rest] = splitVariantProps(
      { size: 'sm', id: 'x', onClick: undefined, variant: 'ghost' },
      ['size', 'variant'],
    );

    expect(variants).toEqual({ size: 'sm', variant: 'ghost' });
    expect(rest).toEqual({ id: 'x', onClick: undefined });
  });
});
