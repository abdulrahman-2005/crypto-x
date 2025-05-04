"use client"

import dynamic from 'next/dynamic'

// Dynamically import the FuturisticEffects component to avoid SSR issues
const FuturisticEffects = dynamic(() => import('./futuristic-effects'), {
  ssr: false
})

export default function FuturisticEffectsWrapper() {
  return <FuturisticEffects />
}
