import { Box } from './threejs-utils'

export default function RobotArmDH({ DHParameters, jointAngles }) {
  const [a0, alpha0, d0, theta0] = DHParameters[0]
  const [a1, alpha1, d1, theta1] = DHParameters[1]
  const [a2, alpha2, d2, theta2] = DHParameters[2]
  const [a3, alpha3, d3, theta3] = DHParameters[3]
  const [a4, alpha4, d4, theta4] = DHParameters[4]
  const [a5, alpha5, d5, theta5] = DHParameters[5]
  const [a6, alpha6, d6, theta6] = DHParameters[6]

  return (
    <group
      position={[0, 0, 0]}
      rotation={[0, jointAngles[0], 0]}
    >
      <Box
        color={'orange'}
        dimensions={[0.05, 0.05, d1]}
        position={[0, d1 / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]} // align DH Z up
      />
      <group
        position={[0, d1, 0]}
        rotation={[0, 0, jointAngles[1]]}
      >
        <Box
          color={'orange'}
          dimensions={[a2, 0.05, 0.05]}
          position={[a2 / 2, 0.05 / 2, 0.05 / 2]}
          rotation={[0, 0, 0]}
        />
        <group
          position={[a2, 0, 0]}
          rotation={[0, 0, jointAngles[2]]}
        >
          <Box
            color={'orange'}
            dimensions={[a3, 0.05, 0.05]}
            position={[a3 / 2, 0.05 / 2, 0.05 / 2]}
            rotation={[0, 0, 0]}
          />
          <group
            position={[a3, 0, 0]}
            rotation={[0, 0, jointAngles[3]]}
          >
            <Box
              color={'orange'}
              dimensions={[0.05, 0.05, d4]}
              position={[0, 0, d4 / 2]}
              rotation={[0, 0, Math.PI / 2]}
            />
            <group
              position={[0, 0, d4]}
              rotation={[0, jointAngles[4], 0]}
            >
              <Box
                color={'orange'}
                dimensions={[0.05, 0.05, d5]}
                position={[0, d5 / 2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <group
                position={[0, d4, 0]}
                rotation={[0, 0, jointAngles[5]]}
              >
                <Box
                  color={'orange'}
                  dimensions={[0.05, 0.05, d6]}
                  position={[0, 0, d6 / 2]}
                  rotation={[0, 0, 0]}
                />
              </group>
            </group>
          </group>
        </group>
      </group> 
    </group>
  )
}


// export default function RobotArmDH({ DHParameters, jointAngles }) {
//   if (DHParameters.length - 1 != undefined) {
//     return
//   }

//   const [, ...tail] = DHParameters
//   const [second, ...tailTail] = tail
//   const [a, alpha, d, theta] = second

//   return (
//     <group rotation={[0, 0, Math.PI / 2]} >
//       <Box color={'orange'} dimensions={[a, 0.1, 0.1]} />
//       {RobotArmDH({ DHParameters: tail, jointAngles })}
//     </group>
//   )
// }
