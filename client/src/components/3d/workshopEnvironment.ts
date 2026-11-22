import * as THREE from 'three';

/**
 * Procedural canvas texture generator for industrial workshop elements.
 * Generates crisp, zero-network textures for hazard stripes, service bay stencils, and diamond plates.
 */
function createHazardStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#eab308'; // Safety yellow
  ctx.fillRect(0, 0, 256, 64);

  ctx.fillStyle = '#18181b'; // Industrial black
  const stripeWidth = 24;
  for (let x = -64; x < 320; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 28, 0);
    ctx.lineTo(x - 12, 64);
    ctx.lineTo(x - 40, 64);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

function createBayStencilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 256);

  // Border guide
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, 992, 224);

  // Stencil text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GEAR UP // 120-POINT CERTIFIED SERVICE BAY 01', 512, 110);

  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('• AUTHORIZED VEHICLE INSPECTION & DIAGNOSTICS •', 512, 175);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createBrandingBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Graphite industrial backdrop
  ctx.fillStyle = '#12161a';
  ctx.fillRect(0, 0, 1024, 256);

  // Top/bottom yellow accent lines
  ctx.fillStyle = '#10b981';
  ctx.fillRect(0, 0, 1024, 12);
  ctx.fillRect(0, 244, 1024, 12);

  // Brand text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 84px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GEAR UP MOTORSPORT', 512, 120);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('ADVANCED MOTORCYCLE DIAGNOSTICS & CERTIFICATION LAB', 512, 185);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createDiamondPlateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22282f';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#3b434d';
  // Small diamond tread pattern
  for (let y = 0; y < 128; y += 32) {
    for (let x = 0; x < 128; x += 32) {
      ctx.beginPath();
      ctx.ellipse(x + 16, y + 16, 10, 4, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 32, y + 32, 10, 4, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

/**
 * Builds the complete 3D Motorcycle Workshop Environment.
 * Dimensions: 14m (W) x 14m (D) x 4.8m (H)
 * Center bay is at (0, 0, 0).
 */
export function buildWorkshopEnvironment(): THREE.Group {
  const workshop = new THREE.Group();
  workshop.name = 'GearUp_Workshop_Environment';

  // Shared reusable materials
  const wallConcreteMat = new THREE.MeshStandardMaterial({
    color: 0x1a1e23,
    roughness: 0.88,
    metalness: 0.15
  });

  const wallWainscotMat = new THREE.MeshStandardMaterial({
    color: 0x111417,
    roughness: 0.6,
    metalness: 0.5
  });

  const steelBeamMat = new THREE.MeshStandardMaterial({
    color: 0x242a30,
    roughness: 0.45,
    metalness: 0.85
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x0f1215,
    roughness: 0.9,
    metalness: 0.35
  });

  const floorConcreteMat = new THREE.MeshStandardMaterial({
    color: 0x181c20,
    roughness: 0.72,
    metalness: 0.25
  });

  const toolCabinetRedMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // Professional tool chest red
    roughness: 0.35,
    metalness: 0.55
  });

  const cabinetTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db, // Aluminum/chrome trim
    roughness: 0.25,
    metalness: 0.85
  });

  const woodBenchMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Heavy oiled timber bench top
    roughness: 0.7,
    metalness: 0.05
  });

  const ledEmissiveMat = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });

  const hazardTexture = createHazardStripeTexture();
  const hazardMat = new THREE.MeshBasicMaterial({
    map: hazardTexture
  });

  const diamondTexture = createDiamondPlateTexture();
  const diamondPlateMat = new THREE.MeshStandardMaterial({
    map: diamondTexture,
    roughness: 0.4,
    metalness: 0.8
  });

  // ---------------------------------------------------------------------------
  // 1. FLOOR & SERVICE BAY MARKINGS
  // ---------------------------------------------------------------------------
  // Main concrete slab
  const floorGeo = new THREE.PlaneGeometry(16, 16);
  const floor = new THREE.Mesh(floorGeo, floorConcreteMat);
  floor.name = 'workshop_floor_mesh';
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.005;
  floor.receiveShadow = true;
  workshop.add(floor);

  // Stencil banner on the floor near the entrance
  const stencilTexture = createBayStencilTexture();
  const stencilGeo = new THREE.PlaneGeometry(4.8, 1.2);
  const stencilMat = new THREE.MeshBasicMaterial({
    map: stencilTexture,
    transparent: true,
    opacity: 0.85
  });
  const stencilMesh = new THREE.Mesh(stencilGeo, stencilMat);
  stencilMesh.rotation.x = -Math.PI / 2;
  stencilMesh.position.set(0, 0.003, 2.3);
  workshop.add(stencilMesh);

  // Yellow service bay perimeter lines (3.2m x 1.6m around the bike)
  const bayLineMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
  const bayLineWidth = 0.06;

  // Front & Back boundary bars
  const frontBarGeo = new THREE.PlaneGeometry(1.8, bayLineWidth);
  const frontBar = new THREE.Mesh(frontBarGeo, bayLineMat);
  frontBar.rotation.x = -Math.PI / 2;
  frontBar.position.set(0, 0.004, 1.55);
  workshop.add(frontBar);

  const rearBar = new THREE.Mesh(frontBarGeo, bayLineMat);
  rearBar.rotation.x = -Math.PI / 2;
  rearBar.position.set(0, 0.004, -1.55);
  workshop.add(rearBar);

  // Left & Right boundary bars
  const sideBarGeo = new THREE.PlaneGeometry(bayLineWidth, 3.1);
  const leftBar = new THREE.Mesh(sideBarGeo, bayLineMat);
  leftBar.rotation.x = -Math.PI / 2;
  leftBar.position.set(-0.9, 0.004, 0);
  workshop.add(leftBar);

  const rightBar = new THREE.Mesh(sideBarGeo, bayLineMat);
  rightBar.rotation.x = -Math.PI / 2;
  rightBar.position.set(0.9, 0.004, 0);
  workshop.add(rightBar);

  // Center white tire guide line
  const centerLineGeo = new THREE.PlaneGeometry(0.04, 2.8);
  const centerLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
  const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
  centerLine.rotation.x = -Math.PI / 2;
  centerLine.position.set(0, 0.005, 0);
  workshop.add(centerLine);

  // ---------------------------------------------------------------------------
  // 2. HYDRAULIC MOTORCYCLE SERVICE LIFT PLATFORM
  // ---------------------------------------------------------------------------
  const liftPlatformGroup = new THREE.Group();
  liftPlatformGroup.position.set(0, 0.02, 0);

  // Main diamond-plate ramp (2.4m x 0.75m x 0.04m)
  const liftTopGeo = new THREE.BoxGeometry(0.75, 0.04, 2.3);
  const liftTop = new THREE.Mesh(liftTopGeo, diamondPlateMat);
  liftTop.receiveShadow = true;
  liftTop.castShadow = true;
  liftPlatformGroup.add(liftTop);

  // Beveled ramp transition at the rear
  const rampTransitionGeo = new THREE.BoxGeometry(0.75, 0.02, 0.35);
  const rampTransition = new THREE.Mesh(rampTransitionGeo, steelBeamMat);
  rampTransition.position.set(0, -0.01, 1.3);
  liftPlatformGroup.add(rampTransition);

  // Scissor lift side safety skirts with hazard stripes
  const skirtGeo = new THREE.BoxGeometry(0.02, 0.04, 2.3);
  const skirtLeft = new THREE.Mesh(skirtGeo, hazardMat);
  skirtLeft.position.set(-0.38, 0, 0);
  liftPlatformGroup.add(skirtLeft);

  const skirtRight = new THREE.Mesh(skirtGeo, hazardMat);
  skirtRight.position.set(0.38, 0, 0);
  liftPlatformGroup.add(skirtRight);

  // Front tire stop / wheel clamp
  const wheelClampGeo = new THREE.BoxGeometry(0.25, 0.14, 0.1);
  const wheelClamp = new THREE.Mesh(wheelClampGeo, steelBeamMat);
  wheelClamp.position.set(0, 0.09, -1.05);
  liftPlatformGroup.add(wheelClamp);

  workshop.add(liftPlatformGroup);

  // ---------------------------------------------------------------------------
  // 3. WORKSHOP WALLS
  // ---------------------------------------------------------------------------
  const wallHeight = 4.8;
  const wallWidth = 15;

  // Back Wall (Z = -7.0)
  const backWallGroup = new THREE.Group();
  backWallGroup.position.set(0, wallHeight / 2, -7.0);

  const backWallGeo = new THREE.BoxGeometry(wallWidth, wallHeight, 0.2);
  const backWall = new THREE.Mesh(backWallGeo, wallConcreteMat);
  backWall.receiveShadow = true;
  backWallGroup.add(backWall);

  // Metal wainscot lower panel
  const wainscotGeo = new THREE.BoxGeometry(wallWidth, 1.5, 0.24);
  const backWainscot = new THREE.Mesh(wainscotGeo, wallWainscotMat);
  backWainscot.position.set(0, -wallHeight / 2 + 0.75, 0);
  backWallGroup.add(backWainscot);

  // Yellow hazard baseboard along back wall
  const baseboardGeo = new THREE.BoxGeometry(wallWidth, 0.12, 0.28);
  const backBaseboard = new THREE.Mesh(baseboardGeo, hazardMat);
  backBaseboard.position.set(0, -wallHeight / 2 + 0.06, 0);
  backWallGroup.add(backBaseboard);

  // Branding Banner on back wall
  const bannerTexture = createBrandingBannerTexture();
  const bannerGeo = new THREE.PlaneGeometry(6.4, 1.6);
  const bannerMat = new THREE.MeshStandardMaterial({
    map: bannerTexture,
    roughness: 0.35,
    metalness: 0.4
  });
  const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
  bannerMesh.position.set(0, 0.8, 0.13);
  backWallGroup.add(bannerMesh);

  workshop.add(backWallGroup);

  // Left Wall (X = -7.0)
  const leftWallGroup = new THREE.Group();
  leftWallGroup.position.set(-7.0, wallHeight / 2, 0);
  leftWallGroup.rotation.y = Math.PI / 2;

  const sideWallGeo = new THREE.BoxGeometry(wallWidth, wallHeight, 0.2);
  const leftWall = new THREE.Mesh(sideWallGeo, wallConcreteMat);
  leftWall.receiveShadow = true;
  leftWallGroup.add(leftWall);

  const leftWainscot = new THREE.Mesh(wainscotGeo, wallWainscotMat);
  leftWainscot.position.set(0, -wallHeight / 2 + 0.75, 0);
  leftWallGroup.add(leftWainscot);

  const leftBaseboard = new THREE.Mesh(baseboardGeo, hazardMat);
  leftBaseboard.position.set(0, -wallHeight / 2 + 0.06, 0);
  leftWallGroup.add(leftBaseboard);

  // Tool pegboard on left wall
  const pegboardGeo = new THREE.PlaneGeometry(4.5, 1.8);
  const pegboardMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.6,
    metalness: 0.3
  });
  const pegboard = new THREE.Mesh(pegboardGeo, pegboardMat);
  pegboard.position.set(-0.5, 0.4, 0.12);
  leftWallGroup.add(pegboard);

  workshop.add(leftWallGroup);

  // Right Wall (X = 7.0)
  const rightWallGroup = new THREE.Group();
  rightWallGroup.position.set(7.0, wallHeight / 2, 0);
  rightWallGroup.rotation.y = -Math.PI / 2;

  const rightWall = new THREE.Mesh(sideWallGeo, wallConcreteMat);
  rightWall.receiveShadow = true;
  rightWallGroup.add(rightWall);

  const rightWainscot = new THREE.Mesh(wainscotGeo, wallWainscotMat);
  rightWainscot.position.set(0, -wallHeight / 2 + 0.75, 0);
  rightWallGroup.add(rightWainscot);

  const rightBaseboard = new THREE.Mesh(baseboardGeo, hazardMat);
  rightBaseboard.position.set(0, -wallHeight / 2 + 0.06, 0);
  rightWallGroup.add(rightBaseboard);

  workshop.add(rightWallGroup);

  // Vertical Steel Support Pillars along walls
  const pillarGeo = new THREE.BoxGeometry(0.35, wallHeight, 0.35);
  const pillarPositions: [number, number, number][] = [
    [-6.8, wallHeight / 2, -6.8],
    [6.8, wallHeight / 2, -6.8],
    [-6.8, wallHeight / 2, 0],
    [6.8, wallHeight / 2, 0],
    [-6.8, wallHeight / 2, -3.5],
    [6.8, wallHeight / 2, -3.5],
  ];

  pillarPositions.forEach((pos) => {
    const pillar = new THREE.Mesh(pillarGeo, steelBeamMat);
    pillar.position.set(...pos);
    workshop.add(pillar);
  });

  // ---------------------------------------------------------------------------
  // 4. ROOF & INDUSTRIAL CEILING TRUSSES
  // ---------------------------------------------------------------------------
  const ceilingHeight = 4.8;
  const ceilingGeo = new THREE.PlaneGeometry(15, 15);
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, ceilingHeight, 0);
  workshop.add(ceiling);

  // Structural Steel I-Beams running across X and Z
  const mainBeamXGeo = new THREE.BoxGeometry(14.5, 0.28, 0.16);
  [-4.0, 0, 4.0].forEach((zPos) => {
    const beam = new THREE.Mesh(mainBeamXGeo, steelBeamMat);
    beam.position.set(0, ceilingHeight - 0.14, zPos);
    workshop.add(beam);
  });

  const mainBeamZGeo = new THREE.BoxGeometry(0.16, 0.28, 14.5);
  [-4.0, 0, 4.0].forEach((xPos) => {
    const beam = new THREE.Mesh(mainBeamZGeo, steelBeamMat);
    beam.position.set(xPos, ceilingHeight - 0.14, 0);
    workshop.add(beam);
  });

  // Long Industrial Ventilation Duct
  const ductGeo = new THREE.CylinderGeometry(0.3, 0.3, 14, 16);
  const ductMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.8
  });
  const duct = new THREE.Mesh(ductGeo, ductMat);
  duct.rotation.x = Math.PI / 2;
  duct.position.set(4.5, ceilingHeight - 0.6, 0);
  workshop.add(duct);

  // ---------------------------------------------------------------------------
  // 5. OVERHEAD RECTANGULAR LED LUMINAIRES
  // ---------------------------------------------------------------------------
  const luminaireGeo = new THREE.BoxGeometry(0.4, 0.08, 2.4);
  const ledPanelGeo = new THREE.PlaneGeometry(0.32, 2.3);

  const lightPositions: [number, number, number][] = [
    [-1.8, ceilingHeight - 0.25, 0],
    [1.8, ceilingHeight - 0.25, 0],
    [0, ceilingHeight - 0.25, -2.5],
    [0, ceilingHeight - 0.25, 2.5]
  ];

  lightPositions.forEach((pos) => {
    const fixtureGroup = new THREE.Group();
    fixtureGroup.position.set(...pos);

    // Dark casing
    const casing = new THREE.Mesh(luminaireGeo, steelBeamMat);
    fixtureGroup.add(casing);

    // Emissive glowing diffuser facing down
    const panel = new THREE.Mesh(ledPanelGeo, ledEmissiveMat);
    panel.rotation.x = Math.PI / 2;
    panel.position.y = -0.042;
    fixtureGroup.add(panel);

    // Actual ceiling spotlight for true workshop illumination
    const spot = new THREE.SpotLight(0xffffff, 2.2, 10, Math.PI / 4, 0.4, 1);
    spot.position.set(0, -0.05, 0);
    spot.target.position.set(0, -4, 0);
    fixtureGroup.add(spot);
    fixtureGroup.add(spot.target);

    workshop.add(fixtureGroup);
  });

  // ---------------------------------------------------------------------------
  // 6. DETAILED WORKSHOP EQUIPMENT & PROPS (OUTSIDE VEHICLE ORBIT)
  // ---------------------------------------------------------------------------

  // Prop A: Heavy-Duty Red Tool Chest & Rolling Cabinet (at X = -3.5, Z = -1.2)
  const toolChestGroup = new THREE.Group();
  toolChestGroup.position.set(-3.5, 0.6, -1.2);

  const cabinetBodyGeo = new THREE.BoxGeometry(1.2, 1.2, 0.65);
  const cabinetBody = new THREE.Mesh(cabinetBodyGeo, toolCabinetRedMat);
  cabinetBody.castShadow = true;
  cabinetBody.receiveShadow = true;
  toolChestGroup.add(cabinetBody);

  // Drawers with chrome handles
  const drawerTrimGeo = new THREE.BoxGeometry(1.05, 0.03, 0.04);
  for (let i = 0; i < 5; i++) {
    const trim = new THREE.Mesh(drawerTrimGeo, cabinetTrimMat);
    trim.position.set(0, -0.45 + i * 0.22, 0.34);
    toolChestGroup.add(trim);
  }

  // Rolling caster wheels
  const wheelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  [[-0.5, -0.62, -0.25], [0.5, -0.62, -0.25], [-0.5, -0.62, 0.25], [0.5, -0.62, 0.25]].forEach((wPos) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(wPos[0], wPos[1], wPos[2]);
    wheel.rotation.z = Math.PI / 2;
    toolChestGroup.add(wheel);
  });
  workshop.add(toolChestGroup);

  // Prop B: Mechanic Workbench with Laptop Diagnostic Console (at X = -3.5, Z = 1.6)
  const workbenchGroup = new THREE.Group();
  workbenchGroup.position.set(-3.5, 0.45, 1.6);

  // Heavy steel frame
  const benchTopGeo = new THREE.BoxGeometry(1.6, 0.08, 0.75);
  const benchTop = new THREE.Mesh(benchTopGeo, woodBenchMat);
  benchTop.position.y = 0.45;
  benchTop.castShadow = true;
  workbenchGroup.add(benchTop);

  // Steel legs
  const benchLegGeo = new THREE.BoxGeometry(0.08, 0.9, 0.08);
  [[-0.72, 0, -0.3], [0.72, 0, -0.3], [-0.72, 0, 0.3], [0.72, 0, 0.3]].forEach((lPos) => {
    const leg = new THREE.Mesh(benchLegGeo, steelBeamMat);
    leg.position.set(lPos[0], lPos[1], lPos[2]);
    workbenchGroup.add(leg);
  });

  // Diagnostic Laptop on bench
  const laptopBaseGeo = new THREE.BoxGeometry(0.34, 0.02, 0.25);
  const laptopBase = new THREE.Mesh(laptopBaseGeo, cabinetTrimMat);
  laptopBase.position.set(-0.25, 0.5, 0.05);
  workbenchGroup.add(laptopBase);

  const laptopScreenGeo = new THREE.BoxGeometry(0.34, 0.22, 0.015);
  const laptopScreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const laptopScreen = new THREE.Mesh(laptopScreenGeo, laptopScreenMat);
  laptopScreen.position.set(-0.25, 0.6, -0.06);
  laptopScreen.rotation.x = -0.2;
  workbenchGroup.add(laptopScreen);

  // Mechanic Vice mounted on right corner of workbench
  const viceGeo = new THREE.BoxGeometry(0.18, 0.16, 0.18);
  const vice = new THREE.Mesh(viceGeo, steelBeamMat);
  vice.position.set(0.65, 0.56, 0.2);
  workbenchGroup.add(vice);

  workshop.add(workbenchGroup);

  // Prop C: 4-Tier Metal Parts Shelving Unit (at X = 3.6, Z = -1.5)
  const shelvingGroup = new THREE.Group();
  shelvingGroup.position.set(3.6, 1.1, -1.5);

  const shelfTierGeo = new THREE.BoxGeometry(0.65, 0.04, 2.0);
  for (let i = 0; i < 4; i++) {
    const tier = new THREE.Mesh(shelfTierGeo, steelBeamMat);
    tier.position.y = -0.9 + i * 0.6;
    shelvingGroup.add(tier);
  }

  // 4 corner upright angle bars
  const uprightGeo = new THREE.BoxGeometry(0.05, 2.2, 0.05);
  [[-0.3, 0.05, -0.98], [0.3, 0.05, -0.98], [-0.3, 0.05, 0.98], [0.3, 0.05, 0.98]].forEach((uPos) => {
    const upright = new THREE.Mesh(uprightGeo, steelBeamMat);
    upright.position.set(uPos[0], uPos[1], uPos[2]);
    shelvingGroup.add(upright);
  });

  // Storage boxes & oil canisters on shelves
  const boxGeo = new THREE.BoxGeometry(0.35, 0.3, 0.4);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 });
  const box1 = new THREE.Mesh(boxGeo, boxMat);
  box1.position.set(0, -0.12, -0.5);
  shelvingGroup.add(box1);

  const canisterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12);
  const canisterMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
  const can1 = new THREE.Mesh(canisterGeo, canisterMat);
  can1.position.set(0, 0.48, 0.3);
  shelvingGroup.add(can1);

  const can2 = new THREE.Mesh(canisterGeo, canisterMat);
  can2.position.set(0, 0.48, -0.2);
  shelvingGroup.add(can2);

  workshop.add(shelvingGroup);

  // Prop D: Dual Tire Storage Rack (at X = 3.6, Z = 1.5)
  const tireRackGroup = new THREE.Group();
  tireRackGroup.position.set(3.6, 0.75, 1.5);

  const tireGeo = new THREE.TorusGeometry(0.32, 0.11, 12, 24);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
  for (let t = 0; t < 3; t++) {
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.y = Math.PI / 2;
    tire.position.set(0, 0, -0.4 + t * 0.35);
    tireRackGroup.add(tire);
  }
  workshop.add(tireRackGroup);

  // Prop E: Industrial Air Compressor (at X = -4.0, Z = -3.8)
  const compressorGroup = new THREE.Group();
  compressorGroup.position.set(-4.0, 0.45, -3.8);

  const tankGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.9, 16);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.6 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.rotation.z = Math.PI / 2;
  compressorGroup.add(tank);

  const motorGeo = new THREE.BoxGeometry(0.3, 0.25, 0.3);
  const motor = new THREE.Mesh(motorGeo, steelBeamMat);
  motor.position.set(0, 0.35, 0);
  compressorGroup.add(motor);

  workshop.add(compressorGroup);

  return workshop;
}

/**
 * Cleanly disposes all geometries and materials of the workshop environment.
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
