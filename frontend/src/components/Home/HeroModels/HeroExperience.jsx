import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useState } from 'react'
import HeroModel from './HeroModel'
import { useTheme } from '../../../context/ThemeContext'

const HeroExperience = () => {
  const [loaded, setLoaded] = useState(false)
  const { theme } = useTheme() // Safe — outside Canvas

  // Accent color for the loader ring changes with theme
  const loaderColor = theme === 'light' ? 'border-red-500' : 'border-blue-400'

  return (
    <div className='w-full h-full relative'>

      {!loaded && (
        <div className='absolute inset-0 z-50 flex items-center justify-center'
          style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className='flex flex-col items-center gap-4'>
            <div className={`w-16 h-16 rounded-full border-2 ${loaderColor} border-t-transparent animate-spin`} />
            <p className='text-xs tracking-widest uppercase' style={{ color: 'var(--text-muted)' }}>
              {theme === 'light' ? 'Initializing...' : 'Loading'}
            </p>
          </div>
        </div>
      )}

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null} onResolve={() => setLoaded(true)}>
          <ambientLight intensity={theme === 'light' ? 1.2 : 0.8} />
          <directionalLight position={[5, 5, 5]} intensity={theme === 'light' ? 2.0 : 1.5} />
          <directionalLight position={[-5, 2, -5]} intensity={0.5} />
          {/* Light mode uses a warmer environment, dark uses city neon */}
          <Environment preset={theme === 'light' ? 'sunset' : 'city'} />
          <HeroModel onLoad={() => setLoaded(true)} theme={theme} />
        </Suspense>

        <OrbitControls
          makeDefault
          enableZoom
          enableRotate
          enablePan={false}
          minDistance={2}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={1}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}

export default HeroExperience
