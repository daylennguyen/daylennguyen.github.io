'use client';

import { useEffect, useRef, useState } from 'react';

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
  hurt: {
    frames: [
      { x: 49, y: 750, width: 160, height: 160 },
      { x: 279, y: 750, width: 160, height: 160 },
    ],
    speed: 0.25,
  },
};

const BLOCK_TEXTURES = {
  grass: { x: 2, y: 2, width: 16, height: 16 },
  dirt: { x: 21, y: 2, width: 16, height: 16 },
};

const BLOCK_SIZE = 48; // Rendered size of each block
const CHICKEN_SIZE = 80; // Rendered size of the chicken

const HURT_DURATION_MS = 500;
/** Extra lift when hurt so the sprite’s feet aren’t cut off by the ground */

const GRAVITY = 0.35;
const IMPULSE_UP = -11;
const IMPULSE_BACK = 6;
const AIR_FRICTION = 0.98;

interface Chicken {
  x: number;
  targetX: number;
  frame: number;
  animTimer: number;
  facing: 'left' | 'right';
  state: 'idle' | 'walking' | 'hurt';
  hurtUntil: number;
  hurtStarted: number;
  vy: number;
  yOffset: number;
  vx: number;
}

export default function ChickenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chickenRef = useRef<Chicken>({
    x: 100,
    targetX: 100,
    frame: 0,
    animTimer: 0,
    facing: 'right',
    state: 'idle',
    hurtUntil: 0,
    hurtStarted: 0,
    vy: 0,
    yOffset: 0,
    vx: 0,
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

    chickenImg.src = '/assets/chicken.png';
    blocksImg.src = '/assets/blocks.png';

    chickenImgRef.current = chickenImg;
    blocksImgRef.current = blocksImg;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; // Extra height so hurt chicken’s feet aren’t cut off
      // Re-apply after resize since canvas reset clears this
      ctx.imageSmoothingEnabled = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;
      const floorY = canvas.height - BLOCK_SIZE * 2;
      const chickenY = floorY - CHICKEN_SIZE + 4;
      const chicken = chickenRef.current;
      const chickenDrawY = chickenY - chicken.yOffset;
      const inX = canvasX >= chicken.x && canvasX <= chicken.x + CHICKEN_SIZE;
      const inY = canvasY >= chickenDrawY && canvasY <= chickenDrawY + CHICKEN_SIZE;
      canvas.style.cursor = inX && inY ? 'pointer' : 'default';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;
      const floorY = canvas.height - BLOCK_SIZE * 2;
      const chickenY = floorY - CHICKEN_SIZE + 4;
      const chicken = chickenRef.current;
      const chickenDrawY = chickenY - chicken.yOffset;
      const inX = canvasX >= chicken.x && canvasX <= chicken.x + CHICKEN_SIZE;
      const inY = canvasY >= chickenDrawY && canvasY <= chickenDrawY + CHICKEN_SIZE;
      if (inX && inY) {
        const now = Date.now();
        chicken.hurtStarted = now;
        chicken.hurtUntil = now + HURT_DURATION_MS;
        chicken.state = 'hurt';
        chicken.frame = 0;
        chicken.vy += IMPULSE_UP;
        chicken.vx += chicken.facing === 'right' ? -IMPULSE_BACK : IMPULSE_BACK;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    let animationId: number;
    let lastTime = performance.now();

    const drawBlock = (type: 'grass' | 'dirt', x: number, y: number) => {
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
      facing: 'left' | 'right',
      animation: 'stand' | 'walking' | 'hurt',
      frame: number
    ) => {
      const chickenImg = chickenImgRef.current;
      if (!chickenImg) return;

      const anim = CHICKEN_ANIMATIONS[animation];
      const frameData = anim.frames[frame % anim.frames.length];

      ctx.save();

      if (facing === 'left') {
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
      const now = Date.now();

      // End hurt state when duration has passed
      if (chicken.state === 'hurt' && now >= chicken.hurtUntil) {
        chicken.state = 'idle';
        chicken.hurtUntil = 0;
        chicken.hurtStarted = 0;
      }

      // Gravity: always apply when in air
      chicken.vy += GRAVITY * deltaTime;
      chicken.yOffset -= chicken.vy * deltaTime;
      if (chicken.yOffset <= 0) {
        chicken.yOffset = 0;
        chicken.vy = 0;
      }

      const inAir = chicken.yOffset > 0 || chicken.vy !== 0;
      if (inAir) {
        chicken.x += chicken.vx * deltaTime;
        chicken.vx *= AIR_FRICTION;
        chicken.x = Math.max(
          0,
          Math.min(canvas.width - CHICKEN_SIZE, chicken.x)
        );
        // While in the air, face the mouse cursor on the x-axis (no rotation)
        const chickenCenterX = chicken.x + CHICKEN_SIZE / 2;
        chicken.facing = mouseXRef.current >= chickenCenterX ? 'right' : 'left';
      } else {
        chicken.vx = 0;
        chicken.targetX = mouseXRef.current - CHICKEN_SIZE / 2;
        const dx = chicken.targetX - chicken.x;
        const speed = 3;

        if (Math.abs(dx) > 10) {
          chicken.state = chicken.state === 'hurt' ? chicken.state : 'walking';
          chicken.facing = dx > 0 ? 'right' : 'left';
          chicken.x += Math.sign(dx) * speed * deltaTime;
        } else if (chicken.state !== 'hurt') {
          chicken.state = 'idle';
        }

        chicken.x = Math.max(
          0,
          Math.min(canvas.width - CHICKEN_SIZE, chicken.x)
        );
      }

      // Update animation frame
      const anim =
        chicken.state === 'hurt'
          ? CHICKEN_ANIMATIONS.hurt
          : chicken.state === 'walking'
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
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, floorY, canvas.width, BLOCK_SIZE * 2);

      // Draw floor blocks (grass on top, dirt below)
      const numBlocks = Math.ceil(canvas.width / BLOCK_SIZE) + 2;

      // Draw dirt layer (bottom)
      for (let i = 0; i < numBlocks; i++) {
        drawBlock('dirt', i * BLOCK_SIZE, floorY + BLOCK_SIZE);
      }

      // Draw grass layer (top)
      for (let i = 0; i < numBlocks; i++) {
        drawBlock('grass', i * BLOCK_SIZE, floorY);
      }

      // Draw chicken on top of the grass (when hurt, offset up and left; extra lift so feet aren’t cut off)
      const chickenY = floorY - CHICKEN_SIZE + 4;
      const drawX = chicken.x;
      const drawY = chickenY - chicken.yOffset;
      const animToUse =
        chicken.state === 'hurt'
          ? 'hurt'
          : chicken.state === 'walking'
          ? 'walking'
          : 'stand';
      drawChicken(
        Math.floor(drawX),
        Math.floor(drawY),
        chicken.facing,
        animToUse,
        chicken.frame
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [imagesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 left-0 w-screen z-0 cursor-default"
      style={{
        height: '100vh',
        imageRendering: 'pixelated',
        // @ts-expect-error - vendor prefixes for cross-browser support
        msInterpolationMode: 'nearest-neighbor',
      }}
    />
  );
}
