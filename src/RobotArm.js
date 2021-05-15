import { useState, useRef } from 'react'
import { useGesture } from 'react-use-gesture'
import { vectorMulScalar } from './math'

export default function RobotArm({ segmentDimensions, jointAngles }) {
  const posedSegments = segmentDimensions.reduce((acc, curr, i) => {
    return acc.concat({
      ...curr,
      position: i === 0 ? [0, 0, 0] : [0, acc[i - 1].dimensions[1], 0],
      rotation: [jointAngles[i], 0, 0],
      hasDragger: i === segmentDimensions.length - 1
    })
  }, [])

  return Chain(posedSegments)
}

function Chain(links) {
  if (!links.length) {
    return
  }

  const [{ dimensions, position, rotation, hasDragger }, ...tail] = links

  return (
    <group {...{ position, rotation }}>
      <Box color={'orange'} {...{ dimensions }} position={vectorMulScalar(dimensions, 0.5)} />
      {Chain(tail)}
      {hasDragger && <Sphere color={'green'} position={dimensions} />}
    </group>
  )
}

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
