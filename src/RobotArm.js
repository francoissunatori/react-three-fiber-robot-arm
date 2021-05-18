import { vectorMulScalar } from './math'
import { Box, Sphere } from './threejs-utils'

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
