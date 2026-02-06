"use client";

import { useEffect, useRef } from "react";
import { Button, MenuList, MenuListItem } from "react95";

export type StartMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onFishyClick: () => void;
};

export default function StartMenu({
  isOpen,
  onToggle,
  onClose,
  onFishyClick,
}: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-block overflow-visible" ref={menuRef}>
      <Button
        variant="menu"
        size="sm"
        active={isOpen}
        onClick={onToggle}
      >
        Start
      </Button>
      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-1 min-w-[140px]">
          <MenuList
            shadow
            className="!relative min-w-[140px] [&_li]:!cursor-pointer"
          >
            <MenuListItem onClick={onClose} className="!cursor-pointer">
              🐈 Kitty
            </MenuListItem>
            <MenuListItem onClick={onFishyClick} className="!cursor-pointer">
              🐟 Fishy
            </MenuListItem>
          </MenuList>
        </div>
      )}
    </div>
  );
}
