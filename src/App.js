import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import './App.scss';

// Import canvas from react three fiber
// Useframe sirve como la funcion de tick para las animaciones
import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { softShadows, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

import { useSpring, a} from '@react-spring/three'
import { Stats } from './tools/Stats';

softShadows()

const SpinningMesh = ({ position , args, color, speed }) => {

  const mesh = useRef(null)

  useFrame(() => ( mesh.current.rotation.x = mesh.current.rotation.y += 0.01 ));


  const [expand, setExpand] = useState(false);

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1,1,1]
  })

  return(
    <a.mesh onClick={(e) => { e.stopPropagation(); setExpand(!expand)}} scale={props.scale} castShadow position={position} ref={mesh}>
      <boxBufferGeometry attach='geometry' args={args} />
      <MeshWobbleMaterial attach='material' color={color} speed={speed} factor={0.6} />
    </a.mesh>
  )
}

const CubesScene = () => {

  const [moveCamera, setMoveCamera] = useState(false)

  const vec = new THREE.Vector3()

  useFrame((state) => {
    const step = 0.05
    // state.camera.position.lerp(vec.set( moveCamera ? 12 : -5, moveCamera ? 10 : 2, 10), step)
    state.camera.lookAt(0,10,0)
    
  })

  return(
    <group>
      <mesh receiveShadow rotation={[-Math.PI /2, 0,0]} position={[0, -3, 0]} onClick={() => {setMoveCamera(!moveCamera)}} >
        <planeBufferGeometry attach='geometry' args={[100,100]} />
        <shadowMaterial attach='material' opacity={0.3} />
      </mesh>
      <SpinningMesh position={[0,1,0]} args={[3,2,1]} color="lightBlue" speed={2} />
      <SpinningMesh position={[-2,1,-5]} color="pink" speed={6} />
      <SpinningMesh position={[5,1,-2]}  color="pink" speed={6} />
    </group>
  )
}

function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 5, mouse.y * 5, camera.position.z), 0.02)
  })
}

function App() {

  return (
    <>
      <Canvas 
        shadows
        camera={{position: [-5, 2, 10], fov: 60}}
      >

        <directionalLight 
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <ambientLight intensity={0.3} />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <CubesScene />
        {/* <Rig /> */}
        <OrbitControls />
        <Stats/>
      </Canvas>
    </>
  );
}

export default App;
