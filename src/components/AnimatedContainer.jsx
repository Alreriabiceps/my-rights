"use client";

import { useEffect, useState, Children, cloneElement } from "react";

/**
 * AnimatedContainer - Wraps children with staggered fade-in animations
 */
export function AnimatedContainer({ 
  children, 
  className = "", 
  animation = "fade-in-up",
  staggerDelay = 100,
  initialDelay = 0
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const animationClass = {
    "fade-in-up": "animate-fade-in-up",
    "fade-in-down": "animate-fade-in-down",
    "slide-in-left": "animate-slide-in-left",
    "slide-in-right": "animate-slide-in-right",
    "scale-up": "animate-scale-up",
    "bounce-in": "animate-bounce-in",
  }[animation] || "animate-fade-in-up";

  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (!child) return null;
        
        const delay = initialDelay + (index * staggerDelay);
        
        return (
          <div
            key={index}
            className={isVisible ? animationClass : "opacity-0"}
            style={{ 
              animationDelay: `${delay}ms`,
              animationFillMode: "forwards"
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * AnimatedItem - Single animated item with configurable animation
 */
export function AnimatedItem({ 
  children, 
  className = "",
  animation = "fade-in-up",
  delay = 0,
  duration = 500
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const animationClass = {
    "fade-in-up": "animate-fade-in-up",
    "fade-in-down": "animate-fade-in-down",
    "slide-in-left": "animate-slide-in-left",
    "slide-in-right": "animate-slide-in-right",
    "scale-up": "animate-scale-up",
    "bounce-in": "animate-bounce-in",
  }[animation] || "animate-fade-in-up";

  return (
    <div
      className={`${className} ${isVisible ? animationClass : "opacity-0"}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: "forwards"
      }}
    >
      {children}
    </div>
  );
}

/**
 * StaggeredList - Renders list items with staggered animation
 */
export function StaggeredList({ 
  items, 
  renderItem, 
  className = "",
  itemClassName = "",
  animation = "fade-in-up",
  staggerDelay = 80,
  initialDelay = 0
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animationClass = {
    "fade-in-up": "animate-fade-in-up",
    "fade-in-down": "animate-fade-in-down",
    "slide-in-left": "animate-slide-in-left",
    "slide-in-right": "animate-slide-in-right",
    "scale-up": "animate-scale-up",
    "bounce-in": "animate-bounce-in",
  }[animation] || "animate-fade-in-up";

  if (!items || items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item, index) => {
        const delay = initialDelay + (index * staggerDelay);
        return (
          <div
            key={index}
            className={`${itemClassName} ${isVisible ? animationClass : "opacity-0"}`}
            style={{ 
              animationDelay: `${delay}ms`,
              animationFillMode: "forwards"
            }}
          >
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedContainer;

