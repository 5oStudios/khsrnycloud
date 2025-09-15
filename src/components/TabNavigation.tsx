import { useState } from "react";

type TabType = "images" | "sounds";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex w-full max-w-md mx-auto mb-8">
      <button
        onClick={() => onTabChange("images")}
        className={`flex-1 py-3 px-6 font-semibold text-sm tracking-wide transition-all duration-300 relative overflow-hidden ${
          activeTab === "images"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="relative z-10">📷 IMAGES</span>
        {activeTab === "images" && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-20 animate-fade-in" />
        )}
        {activeTab === "images" && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan animate-fade-in" />
        )}
      </button>
      
      <button
        onClick={() => onTabChange("sounds")}
        className={`flex-1 py-3 px-6 font-semibold text-sm tracking-wide transition-all duration-300 relative overflow-hidden ${
          activeTab === "sounds"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="relative z-10">🎵 SOUNDS</span>
        {activeTab === "sounds" && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-20 animate-fade-in" />
        )}
        {activeTab === "sounds" && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink animate-fade-in" />
        )}
      </button>
    </div>
  );
};

export default TabNavigation;