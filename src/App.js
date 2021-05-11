import React from 'react'
import { CameraControls } from './three-utils'
import { Canvas } from '@react-three/fiber'
import RobotArm from './RobotArm'

export default function App() {
  return (
    <Canvas>
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <RobotArm
        segmentDimensions={new Array(6).fill({
          dimensions: [0.5, 2, 0.5]
        })}
        jointAngles={[1, 1, 0, 1, 0, 0]}
      />
    </Canvas>
  )
}
