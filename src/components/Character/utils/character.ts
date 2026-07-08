import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                
                // Clone material so we don't modify shared instances
                if (mesh.material) {
                  if (Array.isArray(mesh.material)) {
                    mesh.material = mesh.material.map(m => m.clone());
                  } else {
                    mesh.material = mesh.material.clone();
                  }
                }
                
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                const nodeName = child.name.toLowerCase();
                const geoName = (mesh.geometry && mesh.geometry.name) ? mesh.geometry.name.toLowerCase() : "";

                const isShirt = nodeName.includes("shirt") || geoName.includes("cube.002");
                const isHead = nodeName.includes("cube.002") || geoName.includes("cube.007");
                
                // Robust skin matching: handles case where dots are replaced by underscores in Three.js (e.g. plane.007 -> plane_007)
                const isSkin = isHead || 
                               nodeName.includes("hand") || 
                               nodeName.includes("neck") || 
                               nodeName.includes("ear") || 
                               (nodeName.includes("plane") && nodeName.includes("7")) ||
                               (geoName.includes("plane") && geoName.includes("7")) ||
                               nodeName.includes("face") ||
                               geoName.includes("face");

                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

                materials.forEach((mat: any) => {
                  if (mat && mat.color) {
                    if (isShirt) {
                      // Deep violet/indigo shirt to match the theme accent
                      mat.color.set("#2e215c");
                      mat.roughness = 0.7;
                    } else if (nodeName.includes("pant")) {
                      // Sleek charcoal pants
                      mat.color.set("#151518");
                      mat.roughness = 0.85;
                    } else if (nodeName.includes("shoe")) {
                      // Clean off-white sneakers
                      mat.color.set("#e2e8f0");
                      mat.roughness = 0.5;
                    } else if (nodeName.includes("sole")) {
                      // Sneaker soles
                      mat.color.set("#ffffff");
                      mat.roughness = 0.4;
                    } else if (isSkin) {
                      // Warm, natural human skin tone (same as hands and ears)
                      mat.color.set("#e8c3b0");
                      mat.roughness = 0.6;
                      mat.metalness = 0.0;
                      mat.vertexColors = false; // Prevent vertex colors from making the face look negative/inverted
                      if (mat.map) mat.map = null; // Clear any default maps on skin mesh
                    } else if (nodeName.includes("hair") || nodeName.includes("eyebrow")) {
                      // Espresso brown / black hair
                      mat.color.set("#1a1412");
                      mat.roughness = 0.85;
                    } else if (nodeName.includes("keyboard")) {
                      // Matte dark grey keyboard body
                      mat.color.set("#1e1f22");
                      mat.roughness = 0.35;
                      mat.metalness = 0.5;
                    } else if (nodeName.includes("key")) {
                      // Subtle grey-indigo keycaps
                      mat.color.set("#353740");
                      mat.roughness = 0.4;
                    } else if (
                      nodeName.includes("plane.002") ||
                      nodeName.includes("plane.003") ||
                      nodeName.includes("plane.004")
                    ) {
                      // Slate-colored laptop shell / stand
                      mat.color.set("#18191d");
                      mat.roughness = 0.3;
                      mat.metalness = 0.7;
                    }
                  }
                });
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
