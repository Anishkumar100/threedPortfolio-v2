import { useGLTF, Center } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

useGLTF.preload('/models/batman_light-transformed.glb')
useGLTF.preload('/models/logo_superman.glb')

const MODEL_CONFIG = {
  dark: {
    path:     '/models/batman_light-transformed.glb',
    rotation: [0, Math.PI / 6, 0],
  },
  light: {
    path:     '/models/logo_superman.glb',
    rotation: [0, -Math.PI / 6, 0],
  },
}

const TARGET_HEIGHT = 4.5

const HeroModel = ({ onLoad, theme }) => {
  const config = MODEL_CONFIG[theme] ?? MODEL_CONFIG.dark
  const { scene } = useGLTF(config.path)
  const { viewport } = useThree()

  // Deep clone — recalculates when scene changes (i.e. on theme swap)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  // ── Snapshot viewport width ONCE at first mount only ─────────────────────
  // This ref stores the initial viewport width and NEVER updates.
  // Purpose: prevent scroll from affecting scale (scroll shifts viewport.width).
  // We intentionally do NOT reset this on theme change — screen size hasn't
  // changed just because the user toggled dark/light mode.
  const viewportSnapshot = useRef(null)
  if (viewportSnapshot.current === null) {
    viewportSnapshot.current = viewport.width
  }

  // ── Scale recalculates whenever clonedScene changes (theme swap) ──────────
  // useMemo with [clonedScene] dependency:
  //   - Theme toggles → new GLB loads → clonedScene changes → scale recalculates ✅
  //   - Page scrolls  → viewport.width shifts → clonedScene unchanged → NO recalc ✅
  //   - Refresh       → fresh mount → calculates correctly ✅
  const scale = useMemo(() => {
    const box  = new THREE.Box3().setFromObject(clonedScene)
    const size = new THREE.Vector3()
    box.getSize(size)

    const modelHeight = size.y || 1

    // Use the snapshotted viewport width — immune to scroll drift
    const w = viewportSnapshot.current
    const responsiveTarget =
      w < 5 ? TARGET_HEIGHT * 0.48 :
      w < 8 ? TARGET_HEIGHT * 0.72 :
              TARGET_HEIGHT

    return responsiveTarget / modelHeight
  }, [clonedScene]) // ← ONLY clonedScene, never viewport — this is the key fix

  useEffect(() => {
    if (clonedScene && onLoad) onLoad()
  }, [clonedScene, onLoad])

  return (
    <Center key={theme}>
      <primitive
        object={clonedScene}
        scale={scale}
        rotation={config.rotation}
        position={[0, -1, 0]}
      />
    </Center>
  )
}

export default HeroModel
