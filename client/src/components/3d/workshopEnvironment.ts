import * as THREE from 'three';

/**
 * Procedural texture generators for the Reference Workshop:
 * 1. Dual dashed yellow center aisle runway lines
 * 2. Cinderblock industrial dark wall pattern
 * 3. Diamond treadplate for scissor lifts
 * 4. Pirelli & Motul workshop signage
 */

function createRunwayDashedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 128, 1024);

  // Dual yellow dashed highway / service bay lines
  ctx.fillStyle = '#facc15'; // Vibrant safety yellow
  const dashHeight = 120;
  const gapHeight = 80;
  const lineWidth = 16;
  const leftX = 36;
  const rightX = 76;

  for (let y = 0; y < 1024; y += dashHeight + gapHeight) {
    ctx.fillRect(leftX, y, lineWidth, dashHeight);
    ctx.fillRect(rightX, y, lineWidth, dashHeight);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

function createCinderblockTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e2329'; // Charcoal cinderblock base
  ctx.fillRect(0, 0, 512, 512);

  // Subtle block grid lines
  ctx.strokeStyle = '#14181c';
  ctx.lineWidth = 4;

  const blockH = 48;
  const blockW = 96;

  for (let y = 0; y <= 512; y += blockH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const rowIdx = Math.floor(y / blockH);
    const xOffset = (rowIdx % 2) * (blockW / 2);

    for (let x = xOffset; x <= 512 + blockW; x += blockW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + blockH);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 4);
  return texture;
}

function createDiamondPlateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2b3038';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#4b5563';
  for (let y = 0; y < 128; y += 32) {
    for (let x = 0; x < 128; x += 32) {
      ctx.beginPath();
      ctx.ellipse(x + 16, y + 16, 9, 3.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 32, y + 32, 9, 3.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createSignTexture(brand: 'PIRELLI' | 'MOTUL'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  if (brand === 'PIRELLI') {
    ctx.fillStyle = '#eab308'; // Yellow badge
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#dc2626'; // Red text
    ctx.font = '900 82px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PIRELLI', 256, 110);
  } else {
    ctx.fillStyle = '#dc2626'; // Red badge
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#ffffff'; // White text
    ctx.font = '900 76px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MOTUL', 256, 110);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export interface WorkshopAnimatedLight {
  mesh: THREE.Mesh;
  light?: THREE.Light;
  targetIntensity: number;
  rowOrder: number;
}

export interface WorkshopEnvironmentResult {
  group: THREE.Group;
  overheadLights: WorkshopAnimatedLight[];
  verticalWallLights: WorkshopAnimatedLight[];
  inspectionSpot: THREE.SpotLight;
}

/**
 * Builds the complete 3D Workshop precisely matching the reference photograph.
 * Layout:
 * - Central runway aisle with dual dashed yellow lines
 * - Pitched vaulted ceiling with central skylight corridor
 * - Symmetrical angled gull-wing LED strip luminaires
 * - Vertical wall-mounted LED tubes
 * - Central elevated red hydraulic scissor lift table under the inspection motorcycle
 * - Secondary red scissor lifts along the left wall with blue pneumatic air coiled lines
 * - Heavy-duty 3-tier black industrial tire rack along the right wall packed with tires
 * - Rear wall with office access door, mezzanine observation window, and brand plaques
 */
export function buildWorkshopEnvironment(): WorkshopEnvironmentResult {
  const workshop = new THREE.Group();
  workshop.name = 'Realistic_Garage_Workshop';

  const overheadLights: WorkshopAnimatedLight[] = [];
  const verticalWallLights: WorkshopAnimatedLight[] = [];

  // ---------------------------------------------------------------------------
  // Materials
  // ---------------------------------------------------------------------------
  const cinderblockTexture = createCinderblockTexture();
  const wallMat = new THREE.MeshStandardMaterial({
    map: cinderblockTexture,
    color: 0x22272e,
    roughness: 0.85,
    metalness: 0.2
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x181c22,
    roughness: 0.8,
    metalness: 0.4
  });

  const steelBlackMat = new THREE.MeshStandardMaterial({
    color: 0x14181d,
    roughness: 0.4,
    metalness: 0.85
  });

  const liftRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626, // Vivid hydraulic lift red
    roughness: 0.35,
    metalness: 0.55
  });

  const diamondPlateTexture = createDiamondPlateTexture();
  const diamondPlateMat = new THREE.MeshStandardMaterial({
    map: diamondPlateTexture,
    roughness: 0.3,
    metalness: 0.85
  });

  // Glossy high-reflectance light-grey polished epoxy floor (exactly as in photograph)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x7c838b,
    roughness: 0.16, // High gloss for beautiful reflections of the overhead lights!
    metalness: 0.35
  });

  const ledEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.6,
    roughness: 0.1
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: 0x15181b,
    roughness: 0.92,
    metalness: 0.08
  });

  const blueAirlineMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.4,
    metalness: 0.4
  });

  // ---------------------------------------------------------------------------
  // 1. POLISHED EPOXY FLOOR & DUAL DASHED YELLOW RUNWAY
  // ---------------------------------------------------------------------------
  const roomWidth = 14;
  const roomDepth = 18;
  const ceilingHeight = 5.2;

  // Main high-gloss epoxy concrete floor
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.name = 'workshop_floor_mesh';
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.005;
  floor.receiveShadow = true;
  workshop.add(floor);

  // Dual dashed yellow runway lines running down the central aisle
  const runwayTexture = createRunwayDashedTexture();
  const runwayGeo = new THREE.PlaneGeometry(1.4, roomDepth);
  const runwayMat = new THREE.MeshBasicMaterial({
    map: runwayTexture,
    transparent: true,
    opacity: 0.92
  });
  const runway = new THREE.Mesh(runwayGeo, runwayMat);
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(0, 0.002, 0);
  workshop.add(runway);

  // ---------------------------------------------------------------------------
  // 2. VAULTED CEILING & PITCHED SKYLIGHT CORRIDOR
  // ---------------------------------------------------------------------------
  // Left angled roof ceiling plane
  const roofLeftGeo = new THREE.PlaneGeometry(6.2, roomDepth);
  const roofLeft = new THREE.Mesh(roofLeftGeo, ceilingMat);
  roofLeft.rotation.x = Math.PI / 2;
  roofLeft.rotation.y = 0.12; // pitched upward toward center
  roofLeft.position.set(-3.6, ceilingHeight - 0.25, 0);
  workshop.add(roofLeft);

  // Right angled roof ceiling plane
  const roofRight = new THREE.Mesh(roofLeftGeo, ceilingMat);
  roofRight.rotation.x = Math.PI / 2;
  roofRight.rotation.y = -0.12;
  roofRight.position.set(3.6, ceilingHeight - 0.25, 0);
  workshop.add(roofRight);

  // Central clerestory skylight well
  const skylightWellGeo = new THREE.BoxGeometry(1.6, 0.4, roomDepth);
  const skylightWell = new THREE.Mesh(skylightWellGeo, steelBlackMat);
  skylightWell.position.set(0, ceilingHeight + 0.15, 0);
  workshop.add(skylightWell);

  // Skylight illuminated glass ceiling strip
  const skylightGlassGeo = new THREE.PlaneGeometry(1.4, roomDepth - 1);
  const skylightGlassMat = new THREE.MeshBasicMaterial({
    color: 0xebf8ff,
    transparent: true,
    opacity: 0.65
  });
  const skylightGlass = new THREE.Mesh(skylightGlassGeo, skylightGlassMat);
  skylightGlass.rotation.x = Math.PI / 2;
  skylightGlass.position.set(0, ceilingHeight + 0.2, 0);
  workshop.add(skylightGlass);

  // ---------------------------------------------------------------------------
  // 3. ICONIC OVERHEAD ANGLED LED STRIP LUMINAIRES (WING / CHEVRON ARRAY)
  // ---------------------------------------------------------------------------
  // Symmetrical rows of parallel angled strip fixtures suspended on left and right
  const numRows = 9;
  const startZ = -7.5;
  const endZ = 6.5;
  const zStep = (endZ - startZ) / (numRows - 1);

  const ledTubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 12);
  ledTubeGeo.rotateZ(Math.PI / 2); // horizontal tube

  for (let i = 0; i < numRows; i++) {
    const zPos = startZ + i * zStep;
    const rowOrder = i;

    // Left side angled LED strip (slants from x = -1.2 to x = -3.8)
    const leftFixture = new THREE.Mesh(ledTubeGeo, ledEmissiveMat.clone());
    leftFixture.position.set(-2.5, ceilingHeight - 0.75, zPos);
    leftFixture.rotation.z = -0.18; // angled downward towards the central aisle
    workshop.add(leftFixture);

    // Spotlight below the fixture
    const leftSpot = new THREE.SpotLight(0xffffff, 1.4, 12, Math.PI / 3, 0.4, 1.2);
    leftSpot.position.set(-2.5, ceilingHeight - 0.8, zPos);
    leftSpot.target.position.set(-2.5, 0, zPos);
    workshop.add(leftSpot);
    workshop.add(leftSpot.target);

    overheadLights.push({
      mesh: leftFixture,
      light: leftSpot,
      targetIntensity: 1.4,
      rowOrder
    });

    // Right side angled LED strip (symmetrical)
    const rightFixture = new THREE.Mesh(ledTubeGeo, ledEmissiveMat.clone());
    rightFixture.position.set(2.5, ceilingHeight - 0.75, zPos);
    rightFixture.rotation.z = 0.18;
    workshop.add(rightFixture);

    const rightSpot = new THREE.SpotLight(0xffffff, 1.4, 12, Math.PI / 3, 0.4, 1.2);
    rightSpot.position.set(2.5, ceilingHeight - 0.8, zPos);
    rightSpot.target.position.set(2.5, 0, zPos);
    workshop.add(rightSpot);
    workshop.add(rightSpot.target);

    overheadLights.push({
      mesh: rightFixture,
      light: rightSpot,
      targetIntensity: 1.4,
      rowOrder
    });
  }

  // ---------------------------------------------------------------------------
  // 4. VERTICAL WALL-MOUNTED LED LIGHT TUBES
  // ---------------------------------------------------------------------------
  const vertTubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 12);
  const wallLightSpacing = 1.6;

  for (let z = -6.5; z <= 6.0; z += wallLightSpacing) {
    // Left wall vertical lights
    const vLeft = new THREE.Mesh(vertTubeGeo, ledEmissiveMat.clone());
    vLeft.position.set(-6.85, 2.0, z);
    workshop.add(vLeft);

    const vLeftPoint = new THREE.PointLight(0xffffff, 0.8, 4.5);
    vLeftPoint.position.set(-6.65, 2.0, z);
    workshop.add(vLeftPoint);

    verticalWallLights.push({
      mesh: vLeft,
      light: vLeftPoint,
      targetIntensity: 0.8,
      rowOrder: Math.round((z + 7) / wallLightSpacing)
    });

    // Right wall vertical lights
    const vRight = new THREE.Mesh(vertTubeGeo, ledEmissiveMat.clone());
    vRight.position.set(6.85, 2.0, z);
    workshop.add(vRight);

    const vRightPoint = new THREE.PointLight(0xffffff, 0.8, 4.5);
    vRightPoint.position.set(6.65, 2.0, z);
    workshop.add(vRightPoint);

    verticalWallLights.push({
      mesh: vRight,
      light: vRightPoint,
      targetIntensity: 0.8,
      rowOrder: Math.round((z + 7) / wallLightSpacing)
    });
  }

  // ---------------------------------------------------------------------------
  // 5. SURROUNDING WALLS (DARK CINDERBLOCK ARCHITECTURE)
  // ---------------------------------------------------------------------------
  // Back Wall (Z = -8.5)
  const backWallGeo = new THREE.BoxGeometry(roomWidth, ceilingHeight, 0.3);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, ceilingHeight / 2, -8.5);
  backWall.receiveShadow = true;
  workshop.add(backWall);

  // Office access door in center of back wall
  const doorGeo = new THREE.BoxGeometry(1.2, 2.4, 0.05);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0.6, 1.2, -8.32);
  workshop.add(door);

  // Mezzanine observation glass window above back wall
  const windowFrameGeo = new THREE.BoxGeometry(2.4, 1.1, 0.08);
  const windowFrame = new THREE.Mesh(windowFrameGeo, steelBlackMat);
  windowFrame.position.set(0, 3.6, -8.32);
  workshop.add(windowFrame);

  const windowGlassGeo = new THREE.PlaneGeometry(2.2, 0.9);
  const windowGlassMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.55 });
  const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
  windowGlass.position.set(0, 3.6, -8.27);
  workshop.add(windowGlass);

  // Pirelli & Motul plaques on back wall
  const pirelliTexture = createSignTexture('PIRELLI');
  const pirelliSignGeo = new THREE.PlaneGeometry(1.4, 0.45);
  const pirelliSignMat = new THREE.MeshBasicMaterial({ map: pirelliTexture });
  const pirelliSign = new THREE.Mesh(pirelliSignGeo, pirelliSignMat);
  pirelliSign.position.set(-2.2, 2.6, -8.32);
  workshop.add(pirelliSign);

  const motulTexture = createSignTexture('MOTUL');
  const motulSignMat = new THREE.MeshBasicMaterial({ map: motulTexture });
  const motulSign = new THREE.Mesh(pirelliSignGeo, motulSignMat);
  motulSign.position.set(-4.2, 2.6, -8.32);
  workshop.add(motulSign);

  // Fire extinguisher next to door
  const extGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12);
  const extMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
  const extinguisher = new THREE.Mesh(extGeo, extMat);
  extinguisher.position.set(1.6, 0.6, -8.3);
  workshop.add(extinguisher);

  // Left Wall (X = -7.0)
  const sideWallGeo = new THREE.BoxGeometry(0.3, ceilingHeight, roomDepth);
  const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
  leftWall.position.set(-7.0, ceilingHeight / 2, 0);
  leftWall.receiveShadow = true;
  workshop.add(leftWall);

  // Blue pneumatic air distribution line running along the left wall
  const airPipeGeo = new THREE.CylinderGeometry(0.02, 0.02, roomDepth - 1, 8);
  const airPipe = new THREE.Mesh(airPipeGeo, blueAirlineMat);
  airPipe.rotation.x = Math.PI / 2;
  airPipe.position.set(-6.8, 3.4, 0);
  workshop.add(airPipe);

  // Right Wall (X = 7.0)
  const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
  rightWall.position.set(7.0, ceilingHeight / 2, 0);
  rightWall.receiveShadow = true;
  workshop.add(rightWall);

  // ---------------------------------------------------------------------------
  // 6. RED HYDRAULIC SCISSOR LIFTS (CENTRAL BAY & STAGED BAYS)
  // ---------------------------------------------------------------------------
  function createScissorLift(x: number, z: number, isMainBay: boolean): THREE.Group {
    const lift = new THREE.Group();
    lift.position.set(x, 0, z);

    // Platform deck dimensions: 2.3m long x 0.85m wide x 0.04m height
    const deckGeo = new THREE.BoxGeometry(0.85, 0.04, 2.3);
    const deck = new THREE.Mesh(deckGeo, liftRedMat);
    deck.position.y = isMainBay ? 0.02 : 0.32; // main lift sits grounded under bike; side lifts are raised
    deck.receiveShadow = true;
    deck.castShadow = true;
    lift.add(deck);

    // Diamond plate top surface
    const treadGeo = new THREE.PlaneGeometry(0.75, 2.15);
    const tread = new THREE.Mesh(treadGeo, diamondPlateMat);
    tread.rotation.x = -Math.PI / 2;
    tread.position.set(0, deck.position.y + 0.021, 0);
    tread.receiveShadow = true;
    lift.add(tread);

    // Rear approach ramp
    const rampGeo = new THREE.BoxGeometry(0.85, 0.02, 0.4);
    const ramp = new THREE.Mesh(rampGeo, liftRedMat);
    ramp.position.set(0, (deck.position.y) / 2, 1.3);
    ramp.rotation.x = 0.08;
    lift.add(ramp);

    // Scissor scissor-arms underneath deck
    if (!isMainBay) {
      const armGeo = new THREE.BoxGeometry(0.04, 0.42, 0.04);
      const arm1 = new THREE.Mesh(armGeo, liftRedMat);
      arm1.position.set(-0.35, 0.16, 0);
      arm1.rotation.z = 0.4;
      lift.add(arm1);

      const arm2 = new THREE.Mesh(armGeo, liftRedMat);
      arm2.position.set(0.35, 0.16, 0);
      arm2.rotation.z = -0.4;
      lift.add(arm2);
    }

    return lift;
  }

  // Main central service lift platform under the inspection bike
  const mainLift = createScissorLift(0, 0, true);
  workshop.add(mainLift);

  // Secondary elevated red scissor lifts on the left service bay (as in reference photo)
  const sideLift1 = createScissorLift(-3.8, -3.2, false);
  workshop.add(sideLift1);

  const sideLift2 = createScissorLift(-3.8, 1.2, false);
  workshop.add(sideLift2);

  // ---------------------------------------------------------------------------
  // 7. HEAVY-DUTY MULTI-TIER TIRE RACK (RIGHT WALL)
  // ---------------------------------------------------------------------------
  const tireRackGroup = new THREE.Group();
  tireRackGroup.position.set(4.8, 0, -2.5);

  const rackFrameGeo = new THREE.BoxGeometry(0.06, 3.2, 0.06);
  // 4 vertical upright posts
  [[-0.5, 1.6, -1.8], [0.5, 1.6, -1.8], [-0.5, 1.6, 1.8], [0.5, 1.6, 1.8]].forEach((pos) => {
    const post = new THREE.Mesh(rackFrameGeo, steelBlackMat);
    post.position.set(...(pos as [number, number, number]));
    tireRackGroup.add(post);
  });

  // 3 tire crossbar tiers
  const barGeo = new THREE.BoxGeometry(0.04, 0.04, 3.6);
  [0.6, 1.5, 2.4].forEach((yPos) => {
    const barFront = new THREE.Mesh(barGeo, steelBlackMat);
    barFront.position.set(-0.4, yPos, 0);
    tireRackGroup.add(barFront);

    const barBack = new THREE.Mesh(barGeo, steelBlackMat);
    barBack.position.set(0.4, yPos, 0);
    tireRackGroup.add(barBack);

    // Stacked motorcycle tires on this tier
    const tireGeo = new THREE.TorusGeometry(0.32, 0.11, 10, 20);
    for (let t = -1.6; t <= 1.6; t += 0.28) {
      const tire = new THREE.Mesh(tireGeo, tireRubberMat);
      tire.rotation.y = Math.PI / 2;
      tire.position.set(0, yPos + 0.32, t);
      tireRackGroup.add(tire);
    }
  });

  workshop.add(tireRackGroup);

  // ---------------------------------------------------------------------------
  // 8. FOCUSED CENTRAL INSPECTION SPOTLIGHT
  // ---------------------------------------------------------------------------
  const inspectionSpot = new THREE.SpotLight(0xffffff, 2.6, 14, Math.PI / 4, 0.35, 1.1);
  inspectionSpot.position.set(0, ceilingHeight - 0.4, 0);
  inspectionSpot.target.position.set(0, 0.6, 0);
  inspectionSpot.castShadow = true;
  inspectionSpot.shadow.mapSize.width = 2048;
  inspectionSpot.shadow.mapSize.height = 2048;
  inspectionSpot.shadow.bias = -0.0004;
  workshop.add(inspectionSpot);
  workshop.add(inspectionSpot.target);

  return {
    group: workshop,
    overheadLights,
    verticalWallLights,
    inspectionSpot
  };
}

/**
 * Cleanly disposes all geometries, materials, and procedural canvas textures
 */
export function disposeWorkshopEnvironment(workshop: THREE.Group): void {
  workshop.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => {
          if ((m as any).map) (m as any).map.dispose();
          m.dispose();
        });
      } else if (mesh.material) {
        if ((mesh.material as any).map) (mesh.material as any).map.dispose();
        mesh.material.dispose();
      }
    }
  });
}
