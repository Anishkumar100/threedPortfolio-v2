import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const HeroLoader = ({ onComplete }) => {
  const loaderRef = useRef()
  const scanRef = useRef()
  const textRef = useRef()

  useEffect(() => {
    // Scan line animation — moves down repeatedly
    gsap.to(scanRef.current, {
      y: 120,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // Pulse text
    gsap.to(textRef.current, {
      opacity: 0.3,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])

  // Called by parent when model finishes loading
  const dismiss = () => {
    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete
    })
  }

  // Expose dismiss to parent
  useEffect(() => {
    if (loaderRef.current) loaderRef.current.dismiss = dismiss
  }, [])

  return (
    <div
      ref={loaderRef}
      className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-black'
    >
      {/* Bat signal silhouette */}
      <div className='relative w-32 h-32 mb-6'>
        <img
          src="/images/bg.png"  // replace with a bat logo if you have one
          className='w-full h-full object-contain opacity-20'
        />
        {/* Scan line */}
        <div
          ref={scanRef}
          className='absolute left-0 w-full h-0.5 bg-blue-400 opacity-60'
          style={{ top: 0 }}
        />
      </div>

      <p ref={textRef} className='text-white-50 text-sm tracking-widest uppercase'>
        Initializing...
      </p>
    </div>
  )
}

export default HeroLoader
