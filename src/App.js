import React, { useState } from 'react'
import { CameraControls } from './three-utils'
import { Canvas } from '@react-three/fiber'
import RobotArm from './RobotArm'

const DEG_TO_RAD = Math.PI / 180

export default function App() {
  const [joint1, setJoint1] = useState(0)
  const [joint2, setJoint2] = useState(0)
  const [joint3, setJoint3] = useState(0)
  const [joint4, setJoint4] = useState(0)
  const [joint5, setJoint5] = useState(0)
  const [joint6, setJoint6] = useState(0)

  return (
    <>
      <div>
        Joint 1
        <input type="range" min="0" max="360" value={joint1} onChange={(e) => setJoint1(e.target.value)} class="slider" id="myRange" />
      </div>
      <div>
        Joint 2
        <input type="range" min="0" max="360" value={joint2} onChange={(e) => setJoint2(e.target.value)} class="slider" id="myRange" />
      </div>
      <div>
        Joint 3
        <input type="range" min="0" max="360" value={joint3} onChange={(e) => setJoint3(e.target.value)} class="slider" id="myRange" />
      </div>
      <div>
        Joint 4
        <input type="range" min="0" max="360" value={joint4} onChange={(e) => setJoint4(e.target.value)} class="slider" id="myRange" />
      </div>
      <div>
        Joint 5
        <input type="range" min="0" max="360" value={joint5} onChange={(e) => setJoint5(e.target.value)} class="slider" id="myRange" />
      </div>
      <div>
        Joint 6
        <input type="range" min="0" max="360" value={joint6} onChange={(e) => setJoint6(e.target.value)} class="slider" id="myRange" />
      </div>
      <Canvas>
        <CameraControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <RobotArm
          segmentDimensions={new Array(6).fill({
            dimensions: [0.5, 2, 0.5]
          })}
          jointAngles={[
            joint1 * DEG_TO_RAD,
            joint2 * DEG_TO_RAD,
            joint3 * DEG_TO_RAD,
            joint4 * DEG_TO_RAD,
            joint5 * DEG_TO_RAD,
            joint6 * DEG_TO_RAD
          ]}
        />
      </Canvas>
    </>
  )
}
