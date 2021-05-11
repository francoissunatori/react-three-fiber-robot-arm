import { vectorMulScalar } from './math'

export default function RobotArm({ segmentDimensions, jointAngles }) {
  const posedSegments = segmentDimensions.reduce((acc, curr, i) => {
    return acc.concat({
      ...curr,
      position: i === 0 ? [0, 0, 0] : [0, acc[i - 1].dimensions[1], 0],
      rotation: [jointAngles[i], 0, 0]
    })
  }, [])

  return Chain(posedSegments)
}

function Chain(links) {
  if (!links.length) {
    return
  }

  const [{ dimensions, position, rotation }, ...tail] = links

  return (
    <group {...{ position, rotation }}>
      <Box color={'orange'} {...{ dimensions }} position={vectorMulScalar(dimensions, 0.5)} />
      {Chain(tail)}
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
