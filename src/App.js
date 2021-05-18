import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import RobotArm from './RobotArm'
import OrocosKDLLoader from './OrocosKDLLoader'
import OrocosKDLRobotFactory from './OrocosKDLRobotFactory'
import { Sphere } from './threejs-utils'

const DEG_TO_RAD = Math.PI / 180

export default function App() {
  const [triadPosition, setTriadPosition] = useState([])

  useEffect(() => {
    (
      async function() {
        const OrocosKDL = await OrocosKDLLoader.load()

        const segments = [
          /* base */         new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.None), OrocosKDL.Frame.DH(0, 0, 0, 0)),
          /* link 1 */       new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(0, Math.PI / 2, 0.1625, 0)),
          /* link 2 */       new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(-0.425, 0, 0, 0)),
          /* link 3 */       new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(-0.3922, 0, 0, 0)),
          /* link 4 */       new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(0, Math.PI / 2, 0.1333, 0)),
          /* link 5 */       new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(0, -Math.PI / 2, 0.0997, 0)),
          /* end effector */ new OrocosKDL.Segment(new OrocosKDL.Joint(OrocosKDL.JointType.RotZ), OrocosKDL.Frame.DH(0, 0, 0.0996, 0)),
        ]

        const orocosKDLRobot = OrocosKDLRobotFactory.create(OrocosKDL, segments)
        setTriadPosition(orocosKDLRobot.getThreeJsVector3SegmentTipAtIndexPosition(5))
    })();
  }, [])

  const [joints, setJoints] = useState(new Array(6).fill(0))

  return (
    <>
      {
        joints.map((joint, i) =>
          <div>
            {`Joint${i}`}
            <input type="range" min="0" max="360" value={joint} onChange={(e) => setJoints(joints.map((joint, j) => j === i ? e.target.value : joint))} />
          </div>
        )
      }
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <RobotArm
          segmentDimensions={new Array(6).fill({
            dimensions: [0.5, 2, 0.5]
          })}
          jointAngles={joints.map(joint => joint * DEG_TO_RAD)}
        />
        <Triad />
        <Sphere color={'green'} position={triadPosition} />
      </Canvas>
    </>
  )
}

function Triad() {
  return (
    <>
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x0000ff]} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3, 0x00ff00]} />
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xff0000]} />
    </>
  )
}
