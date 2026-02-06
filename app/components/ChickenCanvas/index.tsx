"use client";

import { useEffect, useRef, useState } from "react";
import type { Chicken, ChickenState } from "./types";
import {
  CHICKEN_ANIMATIONS,
  BLOCK_TEXTURES,
  BLOCK_SIZE,
  CHICKEN_SIZE,
  NAMETAG_TEXT,
  NAMETAG_FONT,
  NAMETAG_PADDING_X,
  NAMETAG_PADDING_Y,
  NAMETAG_OFFSET_ABOVE,
  HURT_DURATION_MS,
  GRAVITY,
  IMPULSE_UP,
  IMPULSE_BACK,
  AIR_FRICTION,
} from "./config";

export default function ChickenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chickenRef = useRef<Chicken>({
    x: 100,
    targetX: 100,
    frame: 0,
    animTimer: 0,
    facing: "right",
    state: "resting",
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
      canvas.height = window.innerHeight;
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
      const inX =
        canvasX >= chicken.x && canvasX <= chicken.x + CHICKEN_SIZE;
      const inY =
        canvasY >= chickenDrawY && canvasY <= chickenDrawY + CHICKEN_SIZE;
      canvas.style.cursor = inX && inY ? "pointer" : "default";
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
      const inX =
        canvasX >= chicken.x && canvasX <= chicken.x + CHICKEN_SIZE;
      const inY =
        canvasY >= chickenDrawY && canvasY <= chickenDrawY + CHICKEN_SIZE;
      if (inX && inY) {
        if (chicken.state === "resting") {
          chicken.state = "idle";
          chicken.frame = 0;
          return;
        }
        const now = Date.now();
        chicken.hurtStarted = now;
        chicken.hurtUntil = now + HURT_DURATION_MS;
        chicken.state = "hurt";
        chicken.frame = 0;
        chicken.vy += IMPULSE_UP;
        chicken.vx += chicken.facing === "right" ? -IMPULSE_BACK : IMPULSE_BACK;
      }
    };

    const handleRightClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (e.clientX - rect.left) * scaleX;
      const canvasY = (e.clientY - rect.top) * scaleY;
      const floorY = canvas.height - BLOCK_SIZE * 2;
      const chickenY = floorY - CHICKEN_SIZE + 4;
      const chicken = chickenRef.current;
      const chickenDrawY = chickenY - chicken.yOffset;
      const inX =
        canvasX >= chicken.x && canvasX <= chicken.x + CHICKEN_SIZE;
      const inY =
        canvasY >= chickenDrawY && canvasY <= chickenDrawY + CHICKEN_SIZE;
      if (inX && inY) {
        e.preventDefault();
        if (chicken.state === "resting") {
          chicken.state = "idle";
          chicken.frame = 0;
        } else if (chicken.state !== "hurt") {
          chicken.state = "resting";
          chicken.frame = 0;
          chicken.vx = 0;
          chicken.vy = 0;
          chicken.yOffset = 0;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("contextmenu", handleRightClick);

    let animationId: number;
    let lastTime = performance.now();

    const drawBlock = (type: "grass" | "dirt", x: number, y: number) => {
      const blocksImg = blocksImgRef.current;
      if (!blocksImg) return;

      const tex = BLOCK_TEXTURES[type];
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
      animation: ChickenState,
      frame: number
    ) => {
      const chickenImg = chickenImgRef.current;
      if (!chickenImg) return;

      // Map state to animation name ('idle' -> 'stand')
      const animKey =
        animation === "idle" ? "stand" : animation;
      const anim = CHICKEN_ANIMATIONS[animKey];
      const frameData = anim.frames[frame % anim.frames.length];

      const isResting = animation === "resting";
      const destW = CHICKEN_SIZE;
      const destH = isResting
        ? Math.round((CHICKEN_SIZE * frameData.height) / frameData.width)
        : CHICKEN_SIZE;
      const drawY = isResting ? y + (CHICKEN_SIZE - destH) : y;

      ctx.save();

      if (facing === "left") {
        ctx.translate(x + destW, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(
          chickenImg,
          frameData.x,
          frameData.y,
          frameData.width,
          frameData.height,
          0,
          0,
          destW,
          destH
        );
      } else {
        ctx.drawImage(
          chickenImg,
          frameData.x,
          frameData.y,
          frameData.width,
          frameData.height,
          x,
          drawY,
          destW,
          destH
        );
      }

      ctx.restore();
    };

    const drawNameTag = (centerX: number, chickenTopY: number) => {
      ctx.save();
      ctx.font = NAMETAG_FONT;
      const metrics = ctx.measureText(NAMETAG_TEXT);
      const textWidth = metrics.width;
      const textHeight = 14;
      const boxWidth = textWidth + NAMETAG_PADDING_X * 2;
      const boxHeight = textHeight + NAMETAG_PADDING_Y * 2;
      const boxLeft = centerX - boxWidth / 2;
      const boxTop = chickenTopY - boxHeight - NAMETAG_OFFSET_ABOVE;

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(NAMETAG_TEXT, centerX, boxTop + boxHeight / 2);

      ctx.restore();
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      ctx.imageSmoothingEnabled = false;

      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;

      const chicken = chickenRef.current;
      const now = Date.now();

      if (chicken.state === "hurt" && now >= chicken.hurtUntil) {
        chicken.state = "idle";
        chicken.hurtUntil = 0;
        chicken.hurtStarted = 0;
      }

      if (chicken.state !== "resting") {
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
          const chickenCenterX = chicken.x + CHICKEN_SIZE / 2;
          chicken.facing =
            mouseXRef.current >= chickenCenterX ? "right" : "left";
        } else {
          chicken.vx = 0;
          chicken.targetX = mouseXRef.current - CHICKEN_SIZE / 2;
          const dx = chicken.targetX - chicken.x;
          const speed = 3;

          if (Math.abs(dx) > 10) {
            chicken.state =
              chicken.state === "hurt" ? chicken.state : "walking";
            chicken.facing = dx > 0 ? "right" : "left";
            chicken.x += Math.sign(dx) * speed * deltaTime;
          } else if (chicken.state !== "hurt") {
            chicken.state = "idle";
          }

          chicken.x = Math.max(
            0,
            Math.min(canvas.width - CHICKEN_SIZE, chicken.x)
          );
        }
      }

      const anim =
        chicken.state === "resting"
          ? CHICKEN_ANIMATIONS.resting
          : chicken.state === "hurt"
          ? CHICKEN_ANIMATIONS.hurt
          : chicken.state === "walking"
          ? CHICKEN_ANIMATIONS.walking
          : CHICKEN_ANIMATIONS.stand;

      chicken.animTimer += deltaTime;
      if (chicken.animTimer > 60 * anim.speed) {
        chicken.animTimer = 0;
        chicken.frame = (chicken.frame + 1) % anim.frames.length;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const floorY = canvas.height - BLOCK_SIZE * 2;
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(0, floorY, canvas.width, BLOCK_SIZE * 2);

      const numBlocks = Math.ceil(canvas.width / BLOCK_SIZE) + 2;

      for (let i = 0; i < numBlocks; i++) {
        drawBlock("dirt", i * BLOCK_SIZE, floorY + BLOCK_SIZE);
      }

      for (let i = 0; i < numBlocks; i++) {
        drawBlock("grass", i * BLOCK_SIZE, floorY);
      }

      const chickenY = floorY - CHICKEN_SIZE + 4;
      const drawX = chicken.x;
      const drawY = chickenY - chicken.yOffset;
      const animToUse = chicken.state;

      drawChicken(
        Math.floor(drawX),
        Math.floor(drawY),
        chicken.facing,
        animToUse,
        chicken.frame
      );

      const restingFrame = CHICKEN_ANIMATIONS.resting.frames[0];
      const restingDestH =
        (CHICKEN_SIZE * restingFrame.height) / restingFrame.width;
      const chickenTopY =
        animToUse === "resting" ? drawY + (CHICKEN_SIZE - restingDestH) : drawY;
      drawNameTag(drawX + CHICKEN_SIZE / 2, chickenTopY);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("contextmenu", handleRightClick);
      cancelAnimationFrame(animationId);
    };
  }, [imagesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 left-0 w-screen z-0 cursor-default"
      style={{
        height: "100vh",
        imageRendering: "pixelated",
        // @ts-expect-error - vendor prefixes for cross-browser support
        msInterpolationMode: "nearest-neighbor",
      }}
    />
  );
}
