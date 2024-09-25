import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/geometries/TextGeometry.js';

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -25 * Math.PI / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const loader = new THREE.TextureLoader();

const geometry = new THREE.IcosahedronGeometry(1, 10);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("1.jpg"), // Make sure this texture is available
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 10000;
const positions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 1000;
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Welcome to Universal', {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-5, 0, -3); // Adjust position
    scene.add(textMesh);
}, undefined, function (error) {
    console.error('An error occurred loading the font:', error);
});

function animate() {
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});
