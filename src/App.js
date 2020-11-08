import React from 'react';
import { Canvas } from 'react-three-fiber';
import { Physics, useCylinder, usePlane } from 'use-cannon';
import { MapControls, PerspectiveCamera } from '@react-three/drei';
import './styles.css';

function Projectile({ worldPoint }) {
  const [ref, api] = useCylinder(() => ({
    type: 'Dynamic',
    mass: 3,
    position: [0, 10, 0],
    rotation: [Math.random(), Math.random(), Math.random()],
    args: [1, 1, 2, 10]
  }));

  const velRef = React.useRef();

  React.useEffect(() => {
    api.velocity.subscribe((v) => {
      velRef.current = v;
    });
  }, [api.velocity]);

  React.useEffect(() => {
    if (worldPoint) {
      api.velocity.set(...worldPoint.toArray());
    }
  }, [api, worldPoint]);

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <cylinderBufferGeometry args={[1, 1, 2, 10]} />
      <meshStandardMaterial color="mediumvioletred" />
    </mesh>
  );
}

function Floor({ handleSetWorldPoint }) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  return (
    <mesh
      onClick={(e) => {
        handleSetWorldPoint(e.intersections[0].point);
      }}
      castShadow
      receiveShadow
      ref={ref}
    >
      <planeBufferGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="lightskyblue" />
    </mesh>
  );
}

export default function App() {
  const [worldPoint, setWorldPoint] = React.useState(undefined);

  const handleSetWorldPoint = React.useCallback((point) => {
    setWorldPoint(point);
  }, []);

  return (
    <Canvas colorManagement concurrent shadowMap>
      <pointLight castShadow position={[0, 10, 0]} />
      <PerspectiveCamera makeDefault position={[0, 150, 0]} />
      <MapControls
        enableDamping={false}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <Physics allowSleep={false} gravity={[0, -10, 0]}>
        <Projectile worldPoint={worldPoint} />
        <Floor handleSetWorldPoint={handleSetWorldPoint} />
      </Physics>
    </Canvas>
  );
}
