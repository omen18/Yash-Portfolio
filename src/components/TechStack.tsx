import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const skillsList = [
  // Full Stack Programming Languages
  { name: "JavaScript", type: "image", url: "/images/javascript.webp" },
  { name: "TypeScript", type: "image", url: "/images/typescript.webp" },
  { name: "Python", type: "image", url: "/images/python.webp" },
  { name: "Java", type: "image", url: "/images/java.webp" },
  { name: "Rust", type: "image", url: "/images/rust.webp" },
  { name: "Swift", type: "image", url: "/images/swift.webp" },
  // Full Stack Frontend
  { name: "HTML", type: "canvas" },
  { name: "CSS", type: "canvas" },
  { name: "React", type: "image", url: "/images/react2.webp" },
  { name: "Next.js", type: "image", url: "/images/next2.webp" },
  { name: "Three.js", type: "image", url: "/images/threejs.webp" },
  // Full Stack Backend & DB
  { name: "Node.js", type: "image", url: "/images/node2.webp" },
  { name: "Express.js", type: "image", url: "/images/express.webp" },
  { name: "FastAPI", type: "image", url: "/images/fastapi.webp" },
  { name: "PostgreSQL", type: "image", url: "/images/postgresql.webp" },
  { name: "MongoDB", type: "image", url: "/images/mongo.webp" },
  { name: "MySQL", type: "image", url: "/images/mysql.webp" },
  // Full Stack Mobile & DevOps
  { name: "SwiftUI", type: "image", url: "/images/swiftui.webp" },
  { name: "Docker", type: "image", url: "/images/docker.webp" },
  { name: "AWS", type: "image", url: "/images/aws.webp" },

  // AI & GenAI Core
  { name: "Machine Learning", type: "canvas" },
  { name: "Deep Learning", type: "canvas" },
  { name: "Generative AI (LLMs)", type: "canvas" },
  { name: "PyTorch", type: "image", url: "/images/pytorch.webp" },
  { name: "TensorFlow", type: "image", url: "/images/tensorflow.webp" },
  { name: "NumPy", type: "image", url: "/images/numpy.webp" },
  { name: "Pandas", type: "image", url: "/images/pandas.webp" },
  // Generative AI Frameworks
  { name: "LangChain", type: "image", url: "/images/langchain.webp" },
  { name: "OpenAI API", type: "image", url: "/images/openai.webp" },
  { name: "HuggingFace", type: "image", url: "/images/huggingface.webp" },
  { name: "RAG", type: "canvas" },
  { name: "Vector DBs", type: "canvas" },
  { name: "Fine-Tuning", type: "canvas" },
  { name: "Prompt Engineering", type: "canvas" },
  // Tools & Integration
  { name: "Git", type: "canvas" },
  { name: "Jupyter Notebook", type: "canvas" },
  { name: "Google Colab", type: "canvas" },
  { name: "GitHub API", type: "canvas" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(48)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshStandardMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

function generateLogoTexture(skillName: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 256);

  ctx.save();
  ctx.translate(128, 128); // center coordinates

  const name = skillName.toLowerCase();

  if (name === "html") {
    // HTML5 Orange Shield
    ctx.fillStyle = "#e34f26";
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(50, -45);
    ctx.lineTo(40, 45);
    ctx.lineTo(0, 60);
    ctx.lineTo(-40, 45);
    ctx.lineTo(-50, -45);
    ctx.closePath();
    ctx.fill();

    // Shield right side shadow
    ctx.fillStyle = "#ef652a";
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(50, -45);
    ctx.lineTo(40, 45);
    ctx.lineTo(0, 60);
    ctx.closePath();
    ctx.fill();

    // Draw White "5"
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 65px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("5", 0, 5);
  } 
  else if (name === "css") {
    // CSS3 Blue Shield
    ctx.fillStyle = "#1572b6";
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(50, -45);
    ctx.lineTo(40, 45);
    ctx.lineTo(0, 60);
    ctx.lineTo(-40, 45);
    ctx.lineTo(-50, -45);
    ctx.closePath();
    ctx.fill();

    // Shield right side shadow
    ctx.fillStyle = "#33a9dc";
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(50, -45);
    ctx.lineTo(40, 45);
    ctx.lineTo(0, 60);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 65px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("3", 0, 5);
  }
  else if (name === "git") {
    // Git Orange Diamond with Branch
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#f05032";
    ctx.beginPath();
    ctx.rect(-45, -45, 90, 90);
    ctx.fill();
    ctx.rotate(-Math.PI / 4);

    // Draw branch path inside
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-15, 30);
    ctx.lineTo(-15, -20);
    ctx.lineTo(15, 10);
    ctx.stroke();

    // Draw nodes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(-15, -20, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-15, 30, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(15, 10, 10, 0, Math.PI * 2); ctx.fill();
  }
  else if (name === "jupyter notebook") {
    // Jupyter Orange Ring with red/gray satellites
    ctx.strokeStyle = "#f37626";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, 55, 25, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Draw central dot
    ctx.fillStyle = "#f37626";
    ctx.beginPath(); ctx.arc(-12, 12, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, -18, 7, 0, Math.PI * 2); ctx.fill();
  }
  else if (name === "google colab") {
    // Google Colab Orange/Blue infinity
    ctx.strokeStyle = "#f9ab00";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(-25, 0, 22, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "#e87114";
    ctx.beginPath();
    ctx.arc(25, 0, 22, 1.25 * Math.PI, 0.75 * Math.PI);
    ctx.stroke();

    // Connect them
    ctx.beginPath();
    ctx.moveTo(-12, -12);
    ctx.lineTo(12, 12);
    ctx.stroke();
  }
  else if (name === "github api") {
    // GitHub Octocat silhouette - using premium purple color
    ctx.fillStyle = "#7928ca";
    ctx.beginPath();
    ctx.arc(0, 5, 45, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-35, -20);
    ctx.lineTo(-45, -45);
    ctx.lineTo(-20, -35);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(35, -20);
    ctx.lineTo(45, -45);
    ctx.lineTo(20, -35);
    ctx.closePath();
    ctx.fill();
  }
  else if (name === "machine learning") {
    // Network Node Concept
    ctx.strokeStyle = "#3f51b5";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-30, 0); ctx.lineTo(30, 0);
    ctx.moveTo(-30, 0); ctx.lineTo(0, -40);
    ctx.moveTo(30, 0); ctx.lineTo(0, -40);
    ctx.moveTo(-30, 0); ctx.lineTo(0, 40);
    ctx.moveTo(30, 0); ctx.lineTo(0, 40);
    ctx.stroke();

    ctx.fillStyle = "#3f51b5";
    ctx.beginPath(); ctx.arc(-30, 0, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(30, 0, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff4081";
    ctx.beginPath(); ctx.arc(0, -40, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 40, 12, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ML", 0, 0);
  }
  else if (name === "deep learning") {
    // Neural Net Nodes
    ctx.strokeStyle = "#7928ca";
    ctx.lineWidth = 2.5;
    const l1 = [-25, 25];
    const l2 = [-40, 0, 40];
    const l3 = [-25, 25];

    for (let x1 of l1) {
      for (let x2 of l2) {
        ctx.beginPath(); ctx.moveTo(-45, x1); ctx.lineTo(0, x2); ctx.stroke();
      }
    }
    for (let x2 of l2) {
      for (let x3 of l3) {
        ctx.beginPath(); ctx.moveTo(0, x2); ctx.lineTo(45, x3); ctx.stroke();
      }
    }

    ctx.fillStyle = "#7928ca";
    for (let x1 of l1) { ctx.beginPath(); ctx.arc(-45, x1, 10, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#ff007a";
    for (let x2 of l2) { ctx.beginPath(); ctx.arc(0, x2, 10, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#7928ca";
    for (let x3 of l3) { ctx.beginPath(); ctx.arc(45, x3, 10, 0, Math.PI * 2); ctx.fill(); }
  }
  else if (name.includes("generative ai")) {
    // Sparkle
    ctx.fillStyle = "#ffaa00";
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.quadraticCurveTo(0, 0, 50, 0);
    ctx.quadraticCurveTo(0, 0, 0, 50);
    ctx.quadraticCurveTo(0, 0, -50, 0);
    ctx.quadraticCurveTo(0, 0, 0, -50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GenAI", 0, 5);
  }
  else if (name === "rag") {
    ctx.fillStyle = "#00bcd4";
    ctx.fillRect(-22, -10, 44, 10);
    ctx.fillRect(-22, 5, 44, 10);
    ctx.fillRect(-22, -25, 44, 10);

    ctx.fillStyle = "#009688";
    ctx.beginPath(); ctx.ellipse(0, -25, 22, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -10, 22, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 5, 22, 6, 0, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = "#ff5722";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("RAG", 0, 32);
  }
  else if (name === "vector dbs") {
    ctx.strokeStyle = "#3f51b5";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -50);
    ctx.moveTo(0, 0); ctx.lineTo(45, 25);
    ctx.moveTo(0, 0); ctx.lineTo(-45, 25);
    ctx.stroke();

    ctx.fillStyle = "#3f51b5";
    ctx.beginPath(); ctx.arc(0, -50, 7, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(45, 25, 7, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-45, 25, 7, 0, Math.PI*2); ctx.fill();
  }
  else if (name === "fine-tuning") {
    ctx.strokeStyle = "#4caf50";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-20, -40); ctx.lineTo(-20, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(0, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, -40); ctx.lineTo(20, 40); ctx.stroke();

    ctx.fillStyle = "#ff9800";
    ctx.beginPath(); ctx.arc(-20, 10, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -20, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 20, 10, 0, Math.PI*2); ctx.fill();
  }
  else if (name === "prompt engineering") {
    // Console outline with purple prompt and pink cursor (no dark grey filled background!)
    ctx.strokeStyle = "#7928ca";
    ctx.lineWidth = 4;
    ctx.strokeRect(-45, -30, 90, 60);

    ctx.fillStyle = "#7928ca";
    ctx.font = "bold 28px Courier";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(">", -30, 0);

    ctx.fillStyle = "#ff007a";
    ctx.fillRect(-10, -12, 12, 24);
  }
  else {
    // Custom fallbacks with premium theme styling
    ctx.fillStyle = "#7928ca";
    ctx.font = "bold 20px Courier";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(skillName.substring(0, 3).toUpperCase(), 0, 0);

    ctx.strokeStyle = "#ff007a";
    ctx.lineWidth = 3;
    ctx.strokeRect(-40, -25, 80, 50);
  }

  ctx.restore();
  return canvas;
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [processedTextures, setProcessedTextures] = useState<THREE.Texture[]>([]);

  useEffect(() => {
    let active = true;

    const loadAndProcessTextures = async () => {
      const results = await Promise.all(
        skillsList.map((skill) => {
          return new Promise<THREE.Texture>((resolve) => {
            if (skill.type === "canvas") {
              const canvas = generateLogoTexture(skill.name);
              const canvasTex = new THREE.CanvasTexture(canvas);
              canvasTex.colorSpace = THREE.SRGBColorSpace;
              resolve(canvasTex);
            } else {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = skill.url!;
              img.onload = () => {
                try {
                  const canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) {
                    const fallbackTex = new THREE.Texture(img);
                    fallbackTex.needsUpdate = true;
                    resolve(fallbackTex);
                    return;
                  }

                  ctx.drawImage(img, 0, 0);
                  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const data = imgData.data;

                  const sampleX = Math.min(5, canvas.width - 1);
                  const sampleY = Math.min(5, canvas.height - 1);
                  const sampleIdx = (sampleY * canvas.width + sampleX) * 4;

                  const rBg = data[sampleIdx];
                  const gBg = data[sampleIdx + 1];
                  const bBg = data[sampleIdx + 2];

                  const threshold = 35; // Tighter threshold to prevent erasing black logos

                  for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    const dist = Math.sqrt(
                      (r - rBg) ** 2 +
                      (g - gBg) ** 2 +
                      (b - bBg) ** 2
                    );

                    const isBg = a < 50 || dist < threshold;

                    if (isBg) {
                      // Make background pure white
                      data[i] = 255;
                      data[i + 1] = 255;
                      data[i + 2] = 255;
                      data[i + 3] = 255;
                    } else {
                      // Color inversion: if the logo element is white/light, convert it to premium purple (#7928ca)
                      const isWhiteLogoPixel = r > 200 && g > 200 && b > 200;
                      if (isWhiteLogoPixel) {
                        data[i] = 121;     // Red (79)
                        data[i + 1] = 40;  // Green (28)
                        data[i + 2] = 202; // Blue (ca)
                      }
                    }
                  }

                  ctx.putImageData(imgData, 0, 0);
                  const canvasTex = new THREE.CanvasTexture(canvas);
                  canvasTex.colorSpace = THREE.SRGBColorSpace;
                  resolve(canvasTex);
                } catch (error) {
                  console.error("Error processing texture with canvas (e.g. CORS/Tainted canvas):", error);
                  const loader = new THREE.TextureLoader();
                  resolve(loader.load(skill.url!));
                }
              };
              img.onerror = () => {
                const loader = new THREE.TextureLoader();
                resolve(loader.load(skill.url!));
              };
            }
          });
        })
      );

      if (active) {
        setProcessedTextures(results);
      }
    };

    loadAndProcessTextures();

    // Refresh ScrollTrigger so GSAP knows the dynamic TechStack height is rendered
    ScrollTrigger.refresh();
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const handleScroll = () => {
      const techstackEl = document.getElementById("techstack");
      if (techstackEl) {
        const rect = techstackEl.getBoundingClientRect();
        setIsActive(rect.top < window.innerHeight + 400 && rect.bottom > -400);
      }
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const materials = useMemo(() => {
    return processedTextures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          color: "#ffffff",
          map: texture,
          metalness: 0.1,
          roughness: 0.1,
        })
    );
  }, [processedTextures]);

  return (
    <div className="techstack" id="techstack">
      <h2> My Techstack</h2>

      {isActive ? (
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
        >
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {materials.length > 0 &&
              spheres.map((props, i) => (
                <SphereGeo
                  key={i}
                  {...props}
                  material={materials[i < materials.length ? i : Math.floor(Math.random() * materials.length)]}
                  isActive={isActive}
                />
              ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
        </Canvas>
      ) : (
        <div className="tech-canvas-placeholder" style={{ height: "100%", width: "100%" }} />
      )}
    </div>
  );
};

export default TechStack;
