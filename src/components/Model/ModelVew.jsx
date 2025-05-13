import { Html, OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import React, { Suspense } from 'react'
import Lights from './Lights'
import IPhone from './IPhone'
import * as THREE from 'three'

export const ModelVew = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  size,
  item,
  setRotationState,
}) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      {/* oxyz */}
      {/* <axesHelper args={[5]} />
      <gridHelper args={[10, 10]} /> */}

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => {
          setRotationState(controlRef.current.getAzimuthalAngle())
          // console.log('Góc azimuthal', controlRef.current.getAzimuthalAngle())
          // const cam = controlRef.current.object.position
          // console.log('Camera position:', cam.x, cam.y, cam.z)
        }}
      />

      <group ref={groupRef} name={index === 1 ? 'small' : 'large'} position={[0, 0, 0]}>
        <Suspense
          fallback={
            <Html>
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <div className="w-[10vw] h-[10vw] rounded-full">Loading...</div>
              </div>
            </Html>
          }
        >
          <IPhone scale={index == 1 ? [15, 15, 15] : [17, 17, 17]} item={item} size={size} />
        </Suspense>
      </group>
    </View>
  )
}
