import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   SHANAYA — 3D PORTFOLIO ENGINE
========================================================= */

const canvas = document.querySelector("#webgl");
const loaderScreen = document.querySelector("#loader");
const loaderProgress = document.querySelector("#loaderProgress");
const loaderStatus = document.querySelector("#loaderStatus");
const modelName = document.querySelector("#modelName");
const sceneLabel = document.querySelector("#sceneLabel");
const sceneProgress = document.querySelector("#sceneProgress");

const isMobile = window.innerWidth < 700;
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   THREE.JS SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x11110f);

scene.fog = new THREE.FogExp2(
  0x11110f,
  isMobile ? 0.055 : 0.038
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(
  isMobile ? 0 : 0.35,
  0.1,
  isMobile ? 8 : 7
);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  1.2
);

scene.add(ambientLight);


const keyLight = new THREE.DirectionalLight(
  0xffffff,
  3
);

keyLight.position.set(
  4,
  6,
  5
);

scene.add(keyLight);


const redLight = new THREE.PointLight(
  0xc27a7c,
  15,
  14
);

redLight.position.set(
  -4,
  1,
  4
);

scene.add(redLight);


const softLight = new THREE.PointLight(
  0xaaa59a,
  10,
  15
);

softLight.position.set(
  4,
  -2,
  2
);

scene.add(softLight);


/* =========================================================
   MAIN 3D GROUP
========================================================= */

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   HERO MODEL
========================================================= */

const modelGroup = new THREE.Group();

world.add(modelGroup);

let realModel = null;


/*
  REAL GLB MODEL

  This is an actual 3D model loaded into Three.js.
*/

const MODEL_URL =
  "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF-Binary/DamagedHelmet.glb";


/* =========================================================
   TEMPORARY 3D FALLBACK

   This is also REAL WebGL 3D geometry.
   It appears instantly while the GLB loads.
========================================================= */

const fallbackGroup = new THREE.Group();

modelGroup.add(fallbackGroup);


const fallbackMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8f7773,
  roughness: 0.24,
  metalness: 0.72,
  clearcoat: 0.8,
  clearcoatRoughness: 0.15
});


const fallbackSphere = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.35, 5),
  fallbackMaterial
);

fallbackSphere.scale.set(
  1,
  1.12,
  0.8
);

fallbackGroup.add(fallbackSphere);


/* =========================================================
   3D RINGS
========================================================= */

const ringGroup = new THREE.Group();

world.add(ringGroup);


const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xa85a5d,
  transparent: true,
  opacity: 0.45
});


const ring1 = new THREE.Mesh(
  new THREE.TorusGeometry(2.05, 0.012, 12, 120),
  ringMaterial
);

ring1.rotation.x = Math.PI / 2.5;

ringGroup.add(ring1);


const ring2 = new THREE.Mesh(
  new THREE.TorusGeometry(2.65, 0.008, 12, 120),
  new THREE.MeshBasicMaterial({
    color: 0xe9e5dc,
    transparent: true,
    opacity: 0.16
  })
);

ring2.rotation.y = Math.PI / 2.4;

ringGroup.add(ring2);


const ring3 = new THREE.Mesh(
  new THREE.TorusGeometry(3.1, 0.006, 12, 120),
  new THREE.MeshBasicMaterial({
    color: 0xe9e5dc,
    transparent: true,
    opacity: 0.1
  })
);

ring3.rotation.x = Math.PI / 3;

ringGroup.add(ring3);


/* =========================================================
   FLOATING PARTICLES
========================================================= */

const particleCount = isMobile ? 500 : 1000;

const particleGeometry = new THREE.BufferGeometry();

const particlePositions = new Float32Array(
  particleCount * 3
);

for (let i = 0; i < particleCount; i++) {

  const radius = 3 + Math.random() * 7;

  const angle = Math.random() * Math.PI * 2;

  const y =
    (Math.random() - 0.5) * 7;

  particlePositions[i * 3] =
    Math.cos(angle) * radius;

  particlePositions[i * 3 + 1] =
    y;

  particlePositions[i * 3 + 2] =
    Math.sin(angle) * radius;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    particlePositions,
    3
  )
);


const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xe9e5dc,
    size: isMobile ? 0.012 : 0.018,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });


const particles = new THREE.Points(
  particleGeometry,
  particleMaterial
);

scene.add(particles);


/* =========================================================
   3D PROJECT PLANES
========================================================= */

const projectImages = [
  "assets/project-1-cropped.png",
  "assets/project-2-cropped.png",
  "assets/project-3-cropped.png",
  "assets/project-4-cropped.png"
];

const projectNames = [
  "PETAL & KNOT",
  "STUDYSPARK AI",
  "LUNA CAFÉ",
  "VELORA"
];

const textureLoader = new THREE.TextureLoader();

const projectGroup = new THREE.Group();

world.add(projectGroup);

const projectMeshes = [];


projectImages.forEach((image, index) => {

  const texture =
    textureLoader.load(
      image,
      () => {
        texture.colorSpace =
          THREE.SRGBColorSpace;
      }
    );

  const material =
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

  const geometry =
    new THREE.PlaneGeometry(
      2.5,
      1.55
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.position.set(
    index % 2 === 0 ? -3.7 : 3.7,
    index * -1.7 + 1,
    -1.2 - index * 0.4
  );

  mesh.rotation.y =
    index % 2 === 0
      ? 0.25
      : -0.25;

  mesh.userData.index = index;

  projectGroup.add(mesh);

  projectMeshes.push(mesh);
});


/* =========================================================
   GLB LOADER
========================================================= */

const gltfLoader = new GLTFLoader();

let modelLoaded = false;

gltfLoader.load(

  MODEL_URL,

  (gltf) => {

    realModel = gltf.scene;

    realModel.scale.set(
      2.05,
      2.05,
      2.05
    );

    realModel.position.set(
      0,
      -1.15,
      0
    );

    realModel.rotation.y =
      -0.35;

    modelGroup.add(realModel);

    fallbackGroup.visible = false;

    modelLoaded = true;

    if (modelName) {
      modelName.textContent =
        "DAMAGED HELMET / GLB";
    }

    updateLoader(
      100,
      "EXPERIENCE READY"
    );

    finishLoading();
  },

  (progress) => {

    if (
      progress.total &&
      progress.loaded
    ) {

      const percent =
        Math.round(
          (progress.loaded /
            progress.total) *
            100
        );

      updateLoader(
        Math.min(percent, 95),
        "LOADING 3D MODEL"
      );

    }

  },

  () => {

    console.warn(
      "3D model could not be loaded. Using WebGL fallback."
    );

    if (modelName) {
      modelName.textContent =
        "LIVE WEBGL OBJECT";
    }

    updateLoader(
      100,
      "EXPERIENCE READY"
    );

    finishLoading();
  }
);


/* =========================================================
   LOADING SCREEN
========================================================= */

let loadingFinished = false;

function updateLoader(
  percent,
  status
) {

  if (loaderProgress) {
    loaderProgress.style.width =
      `${percent}%`;
  }

  if (loaderStatus) {
    loaderStatus.textContent =
      status;
  }
}


function finishLoading() {

  if (loadingFinished) return;

  loadingFinished = true;

  /*
    Keep the loading screen short.
    We don't wait for a giant artificial animation.
  */

  setTimeout(() => {

    if (loaderScreen) {
      loaderScreen.classList.add(
        "loaded"
      );
    }

    document.body.classList.remove(
      "is-loading"
    );

  }, 450);
}


document.body.classList.add(
  "is-loading"
);


/*
  Safety fallback:
  If something takes too long, the
  website still opens.
*/

setTimeout(() => {

  if (!loadingFinished) {

    updateLoader(
      100,
      "EXPERIENCE READY"
    );

    finishLoading();
  }

}, 3500);


/* =========================================================
   MOUSE
========================================================= */

const mouse = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0
};


window.addEventListener(
  "mousemove",
  (event) => {

    mouse.targetX =
      (event.clientX /
        window.innerWidth -
        0.5) *
      2;

    mouse.targetY =
      (event.clientY /
        window.innerHeight -
        0.5) *
      2;

  }
);


/* =========================================================
   TOUCH
========================================================= */

window.addEventListener(
  "touchmove",
  (event) => {

    if (!event.touches[0]) return;

    mouse.targetX =
      (event.touches[0].clientX /
        window.innerWidth -
        0.5) *
      2;

    mouse.targetY =
      (event.touches[0].clientY /
        window.innerHeight -
        0.5) *
      2;

  },
  { passive: true }
);


/* =========================================================
   SCROLL
========================================================= */

let scrollY = window.scrollY;

let targetScroll =
  window.scrollY;

window.addEventListener(
  "scroll",
  () => {

    targetScroll =
      window.scrollY;

  },
  { passive: true }
);


/* =========================================================
   SCENE SECTIONS
========================================================= */

const sceneSections =
  document.querySelectorAll(
    ".scene-section"
  );


let currentScene = 0;

const sceneNames = [
  "SHANAYA / 001",
  "ABOUT / 002",
  "STUDIO / 003",
  "WORK / 004",
  "SERVICES / 005",
  "CONTACT / 006"
];


function updateCurrentScene() {

  const viewportCenter =
    window.innerHeight * 0.5;

  let closestIndex = 0;

  let closestDistance =
    Infinity;

  sceneSections.forEach(
    (section) => {

      const rect =
        section.getBoundingClientRect();

      const center =
        rect.top +
        rect.height / 2;

      const distance =
        Math.abs(
          viewportCenter - center
        );

      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;

        closestIndex =
          Number(
            section.dataset.scene
          );

      }

    }
  );

  currentScene =
    closestIndex;

  if (sceneLabel) {

    sceneLabel.textContent =
      sceneNames[
        currentScene
      ] ||
      "SHANAYA / 001";

  }

  if (sceneProgress) {

    sceneProgress.textContent =
      `${String(
        currentScene + 1
      ).padStart(2, "0")} / 06`;

  }

}


/* =========================================================
   SMOOTH REVEALS
========================================================= */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


revealElements.forEach(
  (element) => {

    revealObserver.observe(
      element
    );

  }
);


/* =========================================================
   FAQ
========================================================= */

const faqItems =
  document.querySelectorAll(
    ".faq-item"
  );


faqItems.forEach(
  (item) => {

    const button =
      item.querySelector(
        ".faq-question"
      );

    if (!button) return;

    button.addEventListener(
      "click",
      () => {

        const isOpen =
          item.classList.contains(
            "open"
          );

        faqItems.forEach(
          (other) => {

            other.classList.remove(
              "open"
            );

            const otherButton =
              other.querySelector(
                ".faq-question"
              );

            if (otherButton) {

              otherButton.setAttribute(
                "aria-expanded",
                "false"
              );

            }

          }
        );

        if (!isOpen) {

          item.classList.add(
            "open"
          );

          button.setAttribute(
            "aria-expanded",
            "true"
          );

        }

      }
    );

  }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
  document.querySelector(
    "#cursor"
  );

const cursorText =
  cursor?.querySelector(
    "span"
  );


const cursorLinks =
  document.querySelectorAll(
    "[data-cursor-text]"
  );


let cursorX = 0;
let cursorY = 0;

let targetCursorX = 0;
let targetCursorY = 0;


window.addEventListener(
  "mousemove",
  (event) => {

    targetCursorX =
      event.clientX;

    targetCursorY =
      event.clientY;

  }
);


cursorLinks.forEach(
  (element) => {

    element.addEventListener(
      "mouseenter",
      () => {

        if (!cursor) return;

        cursor.classList.add(
          "active"
        );

        if (cursorText) {

          cursorText.textContent =
            element.dataset.cursorText ||
            "";

        }

      }
    );

    element.addEventListener(
      "mouseleave",
      () => {

        if (!cursor) return;

        cursor.classList.remove(
          "active"
        );

      }
    );

  }
);


/* =========================================================
   ANIMATION LOOP
========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const elapsed =
    clock.getElapsedTime();


  /*
    Smooth mouse
  */

  mouse.x +=
    (mouse.targetX -
      mouse.x) *
    0.055;

  mouse.y +=
    (mouse.targetY -
      mouse.y) *
    0.055;


  /*
    Smooth page scroll
  */

  scrollY +=
    (targetScroll -
      scrollY) *
    0.075;


  /*
    Update scene
  */

  updateCurrentScene();


  /*
    3D MODEL MOVEMENT
  */

  const sceneAmount =
    currentScene / 5;


  if (!reducedMotion) {

    modelGroup.rotation.y =
      elapsed * 0.18 +
      mouse.x * 0.25;

    modelGroup.rotation.x =
      mouse.y * 0.1;

    modelGroup.position.y =
      Math.sin(
        elapsed * 0.8
      ) * 0.12;

    ringGroup.rotation.z =
      elapsed * 0.07;

    ringGroup.rotation.y =
      elapsed * 0.04;

    particles.rotation.y =
      elapsed * 0.008;

  }


  /*
    Mouse parallax
  */

  world.rotation.y +=
    (
      mouse.x * 0.08 -
      world.rotation.y
    ) * 0.035;

  world.rotation.x +=
    (
      mouse.y * 0.035 -
      world.rotation.x
    ) * 0.035;


  /*
    Scroll-based camera movement
  */

  const scrollFactor =
    scrollY /
    Math.max(
      document.body.scrollHeight -
        window.innerHeight,
      1
    );


  const desiredCameraZ =
    (isMobile ? 8 : 7) -
    scrollFactor * 1.8;


  camera.position.z +=
    (
      desiredCameraZ -
      camera.position.z
    ) * 0.035;


  camera.position.x +=
    (
      mouse.x * 0.35 -
      camera.position.x
    ) * 0.025;


  camera.position.y +=
    (
      -mouse.y * 0.18 -
      camera.position.y
    ) * 0.025;


  /*
    3D project panels
  */

  projectMeshes.forEach(
    (mesh, index) => {

      const offset =
        index -
        currentScene;

      mesh.position.y =
        offset * 1.9;

      mesh.position.z =
        -1.5 -
        Math.abs(offset) * 0.8;

      mesh.rotation.y =
        (index % 2 === 0
          ? 0.24
          : -0.24) +
        mouse.x * 0.08;

      mesh.rotation.x =
        mouse.y * 0.04;

      const distance =
        Math.abs(offset);

      const opacity =
        Math.max(
          0,
          0.55 -
          distance * 0.18
        );

      mesh.material.opacity =
        opacity;

    }
  );


  /*
    Custom cursor smoothing
  */

  if (cursor) {

    cursorX +=
      (
        targetCursorX -
        cursorX
      ) * 0.2;

    cursorY +=
      (
        targetCursorY -
        cursorY
      ) * 0.2;

    cursor.style.left =
      `${cursorX}px`;

    cursor.style.top =
      `${cursorY}px`;

  }


  /*
    Render
  */

  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        window.innerWidth < 700
          ? 1.5
          : 2
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const id =
            link.getAttribute(
              "href"
            );

          if (
            !id ||
            id === "#"
          ) return;

          const target =
            document.querySelector(
              id
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior:
              reducedMotion
                ? "auto"
                : "smooth"
          });

        }
      );

    }
  );


/* =========================================================
   INITIAL STATE
========================================================= */

updateLoader(
  15,
  "INITIALIZING EXPERIENCE"
);

setTimeout(() => {

  updateLoader(
    35,
    "BUILDING 3D SCENE"
  );

}, 150);

setTimeout(() => {

  updateLoader(
    55,
    "LOADING VISUALS"
  );

}, 350);
