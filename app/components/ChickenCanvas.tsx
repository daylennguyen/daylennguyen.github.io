"use client";

import { useEffect, useRef, useState } from "react";

// Sprite sheet configuration from minecwaft-chimken
const CHICKEN_ANIMATIONS = {
  stand: {
    frames: [
      { x: 59, y: 160, width: 160, height: 160 },
      { x: 289, y: 160, width: 160, height: 160 },
      { x: 509, y: 160, width: 160, height: 160 },
    ],
    speed: 0.7,
  },
  walking: {
    frames: [
      { x: 59, y: 440, width: 160, height: 160 },
      { x: 279, y: 440, width: 160, height: 160 },
      { x: 509, y: 440, width: 160, height: 160 },
    ],
    speed: 0.2,
  },
};

const BLOCK_TEXTURES = {
  grass: { x: 2, y: 2, width: 16, height: 16 },
  dirt: { x: 21, y: 2, width: 16, height: 16 },
};

const BLOCK_SIZE = 48; // Rendered size of each block
const CHICKEN_SIZE = 80; // Rendered size of the chicken

interface Chicken {
  x: number;
  targetX: number;
  frame: number;
  animTimer: number;
  facing: "left" | "right";
  state: "idle" | "walking";
}

export default function ChickenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chickenRef = useRef<Chicken>({
    x: 100,
    targetX: 100,
    frame: 0,
    animTimer: 0,
    facing: "right",
    state: "idle",
  });
  const mouseXRef = useRef(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const chickenImgRef = useRef<HTMLImageElement | null>(null);
  const blocksImgRef = useRef<HTMLImageElement | null>(null);

  // Load sprite sheets
  useEffect(() => {
    const chickenImg = new Image();
    const blocksImg = new Image();
    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImagesLoaded(true);
      }
    };

    chickenImg.onload = onLoad;
    blocksImg.onload = onLoad;

    chickenImg.src = "/assets/chicken.png";
    blocksImg.src = "/assets/blocks.png";

    chickenImgRef.current = chickenImg;
    blocksImgRef.current = blocksImg;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 176; // 11rem = 176px (extra height for chicken head)
      // Re-apply after resize since canvas reset clears this
      ctx.imageSmoothingEnabled = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    let lastTime = performance.now();

    const drawBlock = (
      type: "grass" | "dirt",
      x: number,
      y: number
    ) => {
      const blocksImg = blocksImgRef.current;
      if (!blocksImg) return;

      const tex = BLOCK_TEXTURES[type];
      // Use Math.floor and add 1px to size to prevent gaps between tiles
      ctx.drawImage(
        blocksImg,
        tex.x,
        tex.y,
        tex.width,
        tex.height,
        Math.floor(x),
        Math.floor(y),
        BLOCK_SIZE + 1,
        BLOCK_SIZE + 1
      );
    };

    const drawChicken = (
      x: number,
      y: number,
      facing: "left" | "right",
      animation: "stand" | "walking",
      frame: number
    ) => {
      const chickenImg = chickenImgRef.current;
      if (!chickenImg) return;

      const anim = CHICKEN_ANIMATIONS[animation];
      const frameData = anim.frames[frame % anim.frames.length];

      ctx.save();
      
      if (facing === "left") {
        ctx.translate(x + CHICKEN_SIZE, y);
        ctx.scale(-1, 1);
        ctx.drawImage(
          chickenImg,
          frameData.x,
          frameData.y,
          frameData.width,
          frameData.height,
          0,
          0,
          CHICKEN_SIZE,
          CHICKEN_SIZE
        );
      } else {
        ctx.drawImage(
          chickenImg,
          frameData.x,
          frameData.y,
          frameData.width,
          frameData.height,
          x,
          y,
          CHICKEN_SIZE,
          CHICKEN_SIZE
        );
      }
      
      ctx.restore();
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      // Ensure crisp pixel art rendering every frame
      ctx.imageSmoothingEnabled = false;

      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = currentTime;

      const chicken = chickenRef.current;

      // Update chicken target to follow mouse
      chicken.targetX = mouseXRef.current - CHICKEN_SIZE / 2;

      // Move chicken towards target
      const dx = chicken.targetX - chicken.x;
      const speed = 3;

      if (Math.abs(dx) > 10) {
        chicken.state = "walking";
        chicken.facing = dx > 0 ? "right" : "left";
        chicken.x += Math.sign(dx) * speed * deltaTime;
      } else {
        chicken.state = "idle";
      }

      // Keep chicken in bounds
      chicken.x = Math.max(0, Math.min(canvas.width - CHICKEN_SIZE, chicken.x));

      // Update animation frame
      const anim = chicken.state === "walking" 
        ? CHICKEN_ANIMATIONS.walking 
        : CHICKEN_ANIMATIONS.stand;
      
      chicken.animTimer += deltaTime;
      if (chicken.animTimer > 60 * anim.speed) {
        chicken.animTimer = 0;
        chicken.frame = (chicken.frame + 1) % anim.frames.length;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill floor area with solid brown to prevent any gaps showing through
      const floorY = canvas.height - BLOCK_SIZE * 2;
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(0, floorY, canvas.width, BLOCK_SIZE * 2);

      // Draw floor blocks (grass on top, dirt below)
      const numBlocks = Math.ceil(canvas.width / BLOCK_SIZE) + 2;

      // Draw dirt layer (bottom)
      for (let i = 0; i < numBlocks; i++) {
        drawBlock("dirt", i * BLOCK_SIZE, floorY + BLOCK_SIZE);
      }

      // Draw grass layer (top)
      for (let i = 0; i < numBlocks; i++) {
        drawBlock("grass", i * BLOCK_SIZE, floorY);
      }

      // Draw chicken on top of the grass
      // The sprite has padding - position so feet are at the top of the grass layer
      const chickenY = floorY - CHICKEN_SIZE + 4;
      drawChicken(
        Math.floor(chicken.x),
        Math.floor(chickenY),
        chicken.facing,
        chicken.state === "walking" ? "walking" : "stand",
        chicken.frame
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [imagesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 left-0 w-screen pointer-events-none z-0"
      style={{ 
        height: "11rem", 
        imageRendering: "pixelated",
        // @ts-expect-error - vendor prefixes for cross-browser support
        msInterpolationMode: "nearest-neighbor",
      }}
    />
  );
}
