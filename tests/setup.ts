// Setup file for Vitest
// This simulates the original Karma setup where all JS files were concatenated
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mock canvas 2d context for tests
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType: string): any {
    if (contextType === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        canvas: this,
        clearRect: (): void => {},
        fillRect: (): void => {},
        strokeRect: (): void => {},
        beginPath: (): void => {},
        closePath: (): void => {},
        moveTo: (): void => {},
        lineTo: (): void => {},
        bezierCurveTo: (): void => {},
        quadraticCurveTo: (): void => {},
        arc: (): void => {},
        arcTo: (): void => {},
        ellipse: (): void => {},
        rect: (): void => {},
        fill: (): void => {},
        stroke: (): void => {},
        clip: (): void => {},
        isPointInPath: (): boolean => false,
        isPointInStroke: (): boolean => false,
        rotate: (): void => {},
        scale: (): void => {},
        translate: (): void => {},
        transform: (): void => {},
        setTransform: (): void => {},
        resetTransform: (): void => {},
        save: (): void => {},
        restore: (): void => {},
        createLinearGradient: () => ({
          addColorStop: (): void => {}
        }),
        createRadialGradient: () => ({
          addColorStop: (): void => {}
        }),
        createPattern: (): null => null,
        measureText: (text: string) => ({ width: text.length * 10 }),
        getImageData: () => ({ data: [] }),
        putImageData: (): void => {},
        createImageData: () => ({ data: [] }),
        drawImage: (): void => {},
        getLineDash: (): number[] => [],
        setLineDash: (): void => {}
      };
    }
    return originalGetContext.call(this, contextType as any);
  };
}

// Helper function to execute scripts in global context
function loadScript(path: string): void {
  const code = readFileSync(__dirname + '/' + path, 'utf-8');
  // Use eval in global context to make variables global
  globalThis.eval(code);
}

// Load vendor dependencies
loadScript('./vendor/jquery.js');
loadScript('./vendor/lodash.js');

// Load source files in the order they were previously specified in karma.conf.js
loadScript('../src/lib/polyfills.js');
loadScript('../src/constants.js');
loadScript('../src/utilities.js');
loadScript('../src/ease.js');
loadScript('../src/waves.js');
loadScript('../src/sine-waves.js');
