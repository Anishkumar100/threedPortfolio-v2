import { useGLTF, useScroll, Preload } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, Suspense, memo } from 'react'
import * as THREE from 'three'
import { processSteps } from './processSteps'

const ease   = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const TWO_PI = Math.PI * 2
const r1     = (n) => Math.round(n * 10) / 10

const centerScene = (scene) => {
  scene.position.set(0, 0, 0)
  scene.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(scene)
  if (!box.isEmpty()) scene.position.sub(box.getCenter(new THREE.Vector3()))
}

const HeroModel = memo(({ scene, isDark }) => {
  const scroll = useScroll()
  const ref    = useRef()

  const impactRef       = useRef(0)
  const prevLodged      = useRef(true)
  const strikeZ         = useRef(0)
  const cachedWidth     = useRef(0)
  const cachedPositions = useRef([])
  const initialized     = useRef(false)
  const frameCount      = useRef(0)   // counts frames before centering

  useEffect(() => {
    const emissiveColor = isDark
      ? new THREE.Color(0.05, 0.15, 0.4)
      : new THREE.Color(0.4, 0.05, 0.05)

    scene.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return
      child.castShadow    = true
      child.receiveShadow = true
      if (child.material) {
        child.material.metalness         = isDark ? 1.0  : 0.4
        child.material.roughness         = isDark ? 0.25 : 0.55
        child.material.envMapIntensity   = isDark ? 2.0  : 1.2
        child.material.emissive          = emissiveColor
        child.material.emissiveIntensity = 0.04
        child.material.needsUpdate       = true
      }
    })

    frameCount.current   = 0    // reset so we wait 2 frames again
    initialized.current  = false
    cachedWidth.current  = 0
  }, [scene, isDark])

  useFrame((state, delta) => {
    if (!ref.current) return
    const viewport = state.viewport
    if (viewport.width === 0) return

    // Wait 2 frames before centering.
    // Frame 0: <primitive> is added to scene graph, matrices not yet propagated.
    // Frame 1: R3F's renderer has processed the scene, updateMatrixWorld is fresh.
    // Frame 2: Box3.setFromObject now gets correct world-space bounds reliably.
    if (frameCount.current < 2) {
      frameCount.current++
      return
    }

    // Center exactly once after the 2-frame wait
    if (frameCount.current === 2) {
      centerScene(scene)
      frameCount.current = 3   // any value > 2, never enters this block again
      initialized.current = false  // re-snap position after centering
      cachedWidth.current = 0
    }

    const vw = r1(viewport.width)
    if (vw !== cachedWidth.current) {
      cachedWidth.current = vw
      const spread = r1(vw * 0.28)
      cachedPositions.current = processSteps.map((s) =>
        s.side === 'left' ? -spread : s.side === 'right' ? spread : 0
      )
      initialized.current = false
    }

    const positions = cachedPositions.current
    if (!positions.length) return

    const p      = scroll.offset
    const max    = processSteps.length - 1
    const raw    = p * max
    const curr   = Math.min(Math.floor(raw), max)
    const next   = Math.min(curr + 1, max)
    const t      = raw - curr
    const et     = ease(t)
    const lodged = t < 0.08 || t > 0.92

    const justLanded = lodged && !prevLodged.current
    if (justLanded) { impactRef.current = 1.0; strikeZ.current = 1.0 }
    prevLodged.current = lodged

    impactRef.current = Math.max(0, impactRef.current - delta * 8)
    strikeZ.current   = Math.max(0, strikeZ.current   - delta * 4)

    const shake  = impactRef.current * 0.04
    const shakeX = Math.sin(state.clock.elapsedTime * 80) * shake
    const shakeY = Math.cos(state.clock.elapsedTime * 65) * shake

    const tx      = THREE.MathUtils.lerp(positions[curr], positions[next], et)
    const arcPeak = viewport.height * 0.07
    const ty      = lodged ? 0 : -Math.sin(et * Math.PI) * arcPeak
    const tz      = lodged ? strikeZ.current * 0.9 : Math.sin(et * Math.PI) * 0.8

    const base = isDark
      ? (viewport.width < 5 ? 1.0  : 1.9)
      : (viewport.width < 5 ? 0.85 : 1.6)

    if (!initialized.current) {
      initialized.current = true
      ref.current.position.set(tx + shakeX, ty + shakeY, tz)
      ref.current.rotation.set(0.15, 0, 0)
      ref.current.scale.setScalar(base)
      return
    }

    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, tx + shakeX, 0.13)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, ty + shakeY, 0.13)
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, tz, lodged ? 0.18 : 0.13)

    if (lodged) {
      const lx       = positions[t > 0.5 ? next : curr]
      const lz       = lx < -0.1 ? 0.3 : lx > 0.1 ? -0.3 : 0
      const targetRX = strikeZ.current > 0.05
        ? THREE.MathUtils.lerp(0.15, 0.9, strikeZ.current) : 0.15
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRX, 0.15)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0,  0.08)
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, lz, 0.08)
    } else if (isDark) {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, et * TWO_PI * 1.5, 0.25)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, Math.sin(et * Math.PI) * 0.4, 0.1)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y,
        Math.sign(positions[next] - positions[curr]) * Math.sin(et * Math.PI) * 0.4, 0.1)
    } else {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z,
        Math.sign(positions[next] - positions[curr]) * Math.sin(et * Math.PI) * 0.18, 0.08)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -Math.sin(et * Math.PI) * 0.4, 0.1)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y,
        Math.sign(positions[next] - positions[curr]) * Math.sin(et * Math.PI) * 0.5, 0.1)
    }

    const tgtScale = lodged ? base : base * (1 + Math.sin(et * Math.PI) * 0.12)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x || base, tgtScale, 0.1))
  })

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
})

const BatarangScene = memo(() => {
  const { scene } = useGLTF('/models/batman_the_dark_knight_batarang.glb')
  return <HeroModel scene={scene} isDark={true} />
})

const SupermanScene = memo(() => {
  const { scene } = useGLTF('/models/superman.glb')
  return <HeroModel scene={scene} isDark={false} />
})

const BatarangModel = memo(({ isDark }) => (
  <>
    {isDark ? (
      <Suspense fallback={null}><BatarangScene /></Suspense>
    ) : (
      <Suspense fallback={null}><SupermanScene /></Suspense>
    )}
    <Preload all />
  </>
))

useGLTF.preload('/models/batman_the_dark_knight_batarang.glb')
useGLTF.preload('/models/superman.glb')

export default BatarangModel