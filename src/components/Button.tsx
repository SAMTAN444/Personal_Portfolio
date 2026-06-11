// One filled gold primary, the rest thin-outline ghost. Square-ish (2px),
// mono uppercase labels. Renders as <a> when href is given, else <button>.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gold text-ink hover:bg-gold-deep hover:-translate-y-0.5 border border-gold hover:border-gold-deep',
  ghost:
    'bg-transparent text-offwhite border border-faint hover:text-gold hover:border-gold',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-mono text-label uppercase ' +
  'transition-[color,background-color,border-color,transform] duration-200 ease-out select-none'

type CommonProps = {
  variant?: Variant
  children: ReactNode
}

type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = 'ghost', children, className = '', ...rest } = props
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`

  if ('href' in props && props.href !== undefined) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a className={cls} {...anchorRest}>
        {children}
      </a>
    )
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  )
}
