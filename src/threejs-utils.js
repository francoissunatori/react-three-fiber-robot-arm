import { useState, useRef } from 'react'
import { useGesture } from 'react-use-gesture'

function Box({ position, dimensions, color }) {
  return (
    <mesh {...{ position }}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Sphere({ position, color }) {
  const ref = useRef()
  const [sphereOffset, setSphereOffset] = useState([0, 0, 0])

  const bind = useGesture({
    onDrag: ({ offset: [x, y, z] }) => setSphereOffset([x, y, z])
  })

  return (
    <mesh ref={ref} {...bind()} {...{ position: sphereOffset }}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export {
  Box,
  Sphere
}
