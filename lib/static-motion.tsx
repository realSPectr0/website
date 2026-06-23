import React, { forwardRef } from 'react';

type StaticMotionProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

const motionProps = new Set([
  'animate',
  'custom',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'exit',
  'initial',
  'inherit',
  'layout',
  'layoutId',
  'onAnimationComplete',
  'onAnimationStart',
  'onUpdate',
  'transition',
  'variants',
  'viewport',
  'whileDrag',
  'whileFocus',
  'whileHover',
  'whileInView',
  'whileTap',
]);

function createStaticElement(tag: keyof React.JSX.IntrinsicElements) {
  const StaticElement = forwardRef<HTMLElement | SVGElement, StaticMotionProps>(
    function StaticMotionElement(props, ref) {
      const forwardedProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !motionProps.has(key))
      );

      return React.createElement(tag, {
        ...forwardedProps,
        ref,
      });
    }
  );

  StaticElement.displayName = `StaticMotion.${tag}`;

  return StaticElement;
}

export const motion = {
  div: createStaticElement('div'),
  h1: createStaticElement('h1'),
  li: createStaticElement('li'),
  p: createStaticElement('p'),
  path: createStaticElement('path'),
  svg: createStaticElement('svg'),
  ul: createStaticElement('ul'),
};

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
