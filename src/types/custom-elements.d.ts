import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pixel-canvas': any;
    }
  }
  namespace React.JSX {
    interface IntrinsicElements {
      'pixel-canvas': any;
    }
  }
}

export {};


