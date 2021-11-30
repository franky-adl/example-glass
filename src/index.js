import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import HDR from '../static/sepulchral_chapel_rotunda_2k.hdr';
import Glass from '../static/wine_glass.glb';
import {dumpObject} from './common';

const params = {
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.52,
  thickness: 0.1,
  specularIntensity: 1,
  specularColor: 0xffffff,
  lightIntensity: 1,
  exposure: 1
};

let camera, scene, renderer;

let wineGlass;

const hdrEquirect = new RGBELoader()
  .load( HDR, function () {

    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

    init();
    render();

  } );

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = params.exposure;

  renderer.outputEncoding = THREE.sRGBEncoding;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 0, 0, 120 );

  scene.background = hdrEquirect;
  scene.environment = hdrEquirect;

  const material = new THREE.MeshPhysicalMaterial( {
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    transmission: params.transmission,
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    opacity: params.opacity,
    side: THREE.DoubleSide,
    transparent: true
  } );

  const gltf_loader = new GLTFLoader();
  gltf_loader.load(Glass, (gltf) => {
    const root = gltf.scene
    scene.add( root )
    console.log(dumpObject(root).join('\n'))

    wineGlass = root.getObjectByName('Cylinder')

    wineGlass.material = material
    render()
  })

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dirLight);

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 150;

  window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );

  render();

}

function render() {

  renderer.render( scene, camera );

}