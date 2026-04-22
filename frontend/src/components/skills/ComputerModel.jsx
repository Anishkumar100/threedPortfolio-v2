// src/components/skills/ComputerModel.jsx
import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

useGLTF.preload('/models/computer-optimized-transformed.glb')

export default function ComputerModel({ isHovered = false }) {
  const groupRef  = useRef()
  const { scene } = useGLTF('/models/computer-optimized-transformed.glb')

  const SCALE    = 0.011
  const OFFSET_Y = -58.230 * SCALE   // -0.641
  const OFFSET_Z = -77.774 * SCALE   // -0.856

  useEffect(() => {
    scene.traverse(child => {
      if (!child.isMesh) return
      child.castShadow    = true
      child.receiveShadow = true
      if (!child.material) return
      child.material.envMapIntensity = 1.2
      if (child.material.name === 'ComputerDesk.001') {
        child.material.roughness = 0.45
        child.material.metalness = 0.55
      }
      if (child.material.name === 'FloppyDisk.001') {
        child.material.roughness = 0.65
        child.material.metalness = 0.25
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Gentle vertical float only — small amplitude
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.035

    // Slow idle sway — oscillates between -0.1 and +0.1 rad, never spins
    const targetY = Math.sin(t * 0.22) * 0.1
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      isHovered ? targetY * 1.8 : targetY,
      0.025
    )
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={SCALE}
        position={[0, OFFSET_Y, OFFSET_Z]}
      />
    </group>
  )
}