function Box({ position, rotation, dimensions, color }) {
  return (
    <mesh {...{ position, rotation }}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial {...{ color }} />
    </mesh>
  )
}

function Sphere({ position, rotation, color }) {
  return (
    <mesh {...{ position, rotation }}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial {...{ color }} />
    </mesh>
  )
}

export {
  Box,
  Sphere
}
