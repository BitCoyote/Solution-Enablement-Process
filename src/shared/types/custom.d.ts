declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FunctionComponent<React.SVGProps<
      SVGSVGElement
    >>;
    const src: string;
    export default src;
  }
  
  declare module '*.png' {
    const value: any;
    export default value;
  }
  
  declare module '*.svg' {
    const content: any;
    export default content;
  }
  declare module '*.jpeg';
  declare module '*.jpg';
  
  declare namespace JSX {
    interface IntrinsicElements {
      ivion: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
  