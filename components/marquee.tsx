'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 w-fit"
        animate={{
          x: direction === 'left' ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ willChange: 'transform' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

interface MarqueeItemProps {
  children: ReactNode
  className?: string
}

export function MarqueeItem({ children, className = '' }: MarqueeItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex-shrink-0 ${className}`}
    >
      {children}
    </motion.div>
  )
}
