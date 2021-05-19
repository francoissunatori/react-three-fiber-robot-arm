import { useState, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useDrag } from 'react-use-gesture'

function Box({ position, rotation, dimensions, color }) {
  return (
    <mesh {...{ position, rotation }}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial {...{ color }} />
    </mesh>
  )
}

function Sphere({ position, rotation, color, onDrag }) {
  const ref = useRef()

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const bind = useDrag(({ offset: [x, y] }) => {
    const [,, z] = position;
    onDrag([x / aspect, -y / aspect, z])
  }, { pointerEvents: true });

  return (
    <mesh ref={ref} {...bind()} {...{ position, rotation }}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial {...{ color }} />
    </mesh>
  )
}

export {
  Box,
  Sphere
}
