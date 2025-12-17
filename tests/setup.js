// Setup file for Vitest
// This simulates the original Karma setup where all JS files were concatenated
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mock canvas 2d context for tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function(contextType) {
    if (contextType === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        canvas: this,
        clearRect: () => {},
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        quadraticCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        ellipse: () => {},
        rect: () => {},
        fill: () => {},
        stroke: () => {},
        clip: () => {},
        isPointInPath: () => false,
        isPointInStroke: () => false,
        rotate: () => {},
        scale: () => {},
        translate: () => {},
        transform: () => {},
        setTransform: () => {},
        resetTransform: () => {},
        save: () => {},
        restore: () => {},
        createLinearGradient: () => ({
          addColorStop: () => {}
        }),
        createRadialGradient: () => ({
          addColorStop: () => {}
        }),
        createPattern: () => null,
        measureText: (text) => ({ width: text.length * 10 }),
        getImageData: () => ({ data: [] }),
        putImageData: () => {},
        createImageData: () => ({ data: [] }),
        drawImage: () => {},
        getLineDash: () => [],
        setLineDash: () => {}
      };
    }
    return null;
  };
}

// Helper function to execute scripts in global context
function loadScript(path) {
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
