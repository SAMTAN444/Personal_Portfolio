// Scroll-in fade/translate wrapper. Adds .is-visible once the element enters
// the viewport (one-shot). Honors reduced motion by rendering visible up front.
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type Ref,
} from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger delay in ms for sequenced lists. */
  delay?: number
}

// The polymorphic tag, typed to the handful of props we pass. The cast keeps the
// `as` element from collapsing to `never` while staying ref/className/style-safe.
type PolymorphicTag = ComponentType<{
  ref?: Ref<HTMLElement>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}>

export function Reveal({ children, as, className = '', delay = 0 }: RevealProps) {
  const Tag = (as ?? 'div') as unknown as PolymorphicTag
  const ref = useRef<HTMLElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    // Reduced motion shows everything up front (visibility is derived below);
    // no observer, no per-frame work.
    if (reducedMotion) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  const visible = inView || reducedMotion

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay && !reducedMotion ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
