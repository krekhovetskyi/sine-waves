/************************************************
 * @file  Constructor and animation controller
 * @author  Isaac Suttell
 ************************************************/

import * as Utilities from './utilities';
import { Ease, EaseFunction } from './ease';
import { Waves, WaveFunction } from './waves';

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Individual wave configuration
 */
export interface WaveOptions {
  timeModifier?: number;
  amplitude?: number;
  wavelength?: number;
  segmentLength?: number;
  lineWidth?: number;
  strokeStyle?: string;
  type?: string;
  waveFn?: WaveFunction;
}

/**
 * Main SineWaves configuration
 */
export interface SineWavesOptions {
  el: HTMLCanvasElement;
  speed?: number;
  rotate?: number;
  ease?: string | EaseFunction;
  wavesWidth?: string | number;
  waves: WaveOptions[];
  resizeEvent?: () => void;
  initialize?: () => void;
  running?: boolean;
  width?: number | ((el: HTMLCanvasElement) => number);
  height?: number | ((el: HTMLCanvasElement) => number);
  manualUpdate?: boolean;
}

/**
 * Generates multiple customizable animated sines waves
 * using a canvas element. Supports retina displays and
 * limited mobile support
 */
export class SineWaves {
  options: Partial<SineWavesOptions>;
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  waves: WaveOptions[];
  dpr: number;
  width: number = 0;
  height: number = 0;
  waveWidth: number = 0;
  waveLeft: number = 0;
  yAxis: number = 0;
  easeFn: EaseFunction;
  rotation: number;
  running: boolean = true;
  time: number = 0;
  animationId?: number;

  /**
   * Default Options
   */
  private defaultOptions: Partial<SineWavesOptions> = {
    speed: 10,
    rotate: 0,
    ease: 'Linear',
    wavesWidth: '95%',
    manualUpdate: false,
  };

  constructor(options: SineWavesOptions) {
    // Save a reference
    this.options = Utilities.defaults(this.defaultOptions, options);

    // Make sure we have a canvas
    this.el = this.options.el!;
    delete this.options.el;
    if (!this.el) {
      throw 'No Canvas Selected';
    }

    // Setup the context for reference
    const ctx = this.el.getContext('2d');
    if (!ctx) {
      throw 'Could not get canvas context';
    }
    this.ctx = ctx;

    // Do we have any waves
    this.waves = this.options.waves!;
    delete this.options.waves;
    if (!this.waves || !this.waves.length) {
      throw 'No waves specified';
    }

    // DPI
    this.dpr = window.devicePixelRatio || 1;

    // Setup canvas width/heights
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));

    // If the user supplied a resize event or init call it
    this.setupUserFunctions();

    // Setup Easing
    this.easeFn = Utilities.getFn(Ease, this.options.ease!, 'linear') as EaseFunction;

    // Set the canvas rotation
    this.rotation = Utilities.degreesToRadians(this.options.rotate || 0);

    // Should we start running?
    if (Utilities.isType(this.options.running, 'boolean')) {
      this.running = this.options.running!;
    }

    // Assign wave functions
    this.setupWaveFns();

    // Start the magic
    this.loop();
  }

  /**
   * Get the user wave function or one of the built in functions
   */
  setupWaveFns(): void {
    let index = -1;
    const length = this.waves.length;
    while (++index < length) {
      this.waves[index].waveFn = Utilities.getFn(Waves, this.waves[index].type || 'sine', 'sine') as WaveFunction;
    }
  }

  /**
   * Sets up the user resize event and the initialize event
   */
  setupUserFunctions(): void {
    // User Resize Function
    if (Utilities.isFunction(this.options.resizeEvent)) {
      this.options.resizeEvent!.call(this);
      window.addEventListener('resize', this.options.resizeEvent!.bind(this));
    }

    // User initialize
    if (Utilities.isFunction(this.options.initialize)) {
      this.options.initialize!.call(this);
    }
  }

  /**
   * Defaults for each line created
   */
  private defaultWave: WaveOptions = {
    timeModifier: 1,
    amplitude: 50,
    wavelength: 50,
    segmentLength: 10,
    lineWidth: 1,
    strokeStyle: 'rgba(255, 255, 255, 0.2)',
    type: 'Sine'
  };

  /**
   * Takes either pixels or percents and calculates how wide the sine
   * waves should be
   *
   * @param     {string | number}    value    0, '10px', '90%'
   * @param     {number}   width    Width for percentages
   *
   * @return    {number}
   */
  private getWaveWidth(value: string | number, width: number): number {
    if (Utilities.isType(value, 'number')) {
      return value as number;
    }

    let strValue = value.toString();
    if (strValue.indexOf('%') > -1) {
      let numValue = parseFloat(strValue);
      if (numValue > 1) {
        numValue /= 100;
      }
      return width * numValue;
    } else if (strValue.indexOf('px') > -1) {
      return parseInt(strValue, 10);
    }
    return 0;
  }

  /**
   * Get the height or width from a number, function or fallback
   * to the default client dimension
   *
   * @param    {string}   dimension   This can be a function or number
   *
   * @return   {number}
   */
  getDimension(dimension: 'width' | 'height'): number {
    const optionValue = this.options[dimension];
    if (Utilities.isNumber(optionValue)) {
      return optionValue as number;
    } else if (Utilities.isFunction(optionValue)) {
      return (optionValue as Function).call(this, this.el);
    } else if (dimension === 'width') {
      return this.el.clientWidth;
    } else if (dimension === 'height') {
      return this.el.clientHeight;
    }
    return 0;
  }

  /**
   * Internal resize event to make the canvas fill the screen
   */
  updateDimensions(): void {
    // Dimensions
    const width = this.getDimension('width');
    const height = this.getDimension('height');

    // Apply DPR for retina devices
    this.width = this.el.width = width * this.dpr;
    this.height = this.el.height = height * this.dpr;

    // Scale down
    this.el.style.width = width + 'px';
    this.el.style.height = height + 'px';

    // Padding
    this.waveWidth = this.getWaveWidth(this.options.wavesWidth || '95%', this.width);

    // Center it
    this.waveLeft = (this.width - this.waveWidth) / 2;

    // Vertical center
    this.yAxis = this.height / 2;
  }

  /**
   * Clear the canvas so we can redraw
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * This updates each of the lines each loop we're running
   *
   * @param  {number} time (optional) this can be called to
   *                       manually render lines at a certain
   *                       time.
   */
  update(time?: number): void {
    this.time = this.time - 0.007;
    if (typeof time === 'undefined') {
      time = this.time;
    }

    let index = -1;
    const length = this.waves.length;

    // Clear Canvas
    this.clear();

    this.ctx.save();

    if (this.rotation > 0) {
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.rotate(this.rotation);
      this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    // Draw each line
    while (++index < length) {
      const timeModifier = this.waves[index].timeModifier || 1;
      this.drawWave(time * timeModifier, this.waves[index]);
    }
    this.ctx.restore();
  }

  /**
   * Calculate the x, y coordinates of a point in a sine wave
   *
   * @param  {number} time     Internal time index
   * @param  {number} position Pixels x position
   * @param  {WaveOptions} options  Wave options
   *
   * @return {Point}          {x, y}
   */
  getPoint(time: number, position: number, options: WaveOptions): Point {
    let x = (time * this.options.speed!) + (-this.yAxis + position) / options.wavelength!;
    let y = options.waveFn!.call(this, x);

    // Left and Right Sine Easing
    const amplitude = this.easeFn.call(this, position / this.waveWidth, options.amplitude!);

    x = position + this.waveLeft;
    y = amplitude * y + this.yAxis;

    return {
      x: x,
      y: y
    };
  }

  /**
   * Draws one line on the canvas
   *
   * @param  {number} time    current internal clock time
   * @param  {WaveOptions} options wave options
   */
  drawWave(time: number, options: WaveOptions): void {
    // Setup defaults
    options = Utilities.defaults(this.defaultWave, options);

    // Styles
    this.ctx.lineWidth = options.lineWidth! * this.dpr;
    this.ctx.strokeStyle = options.strokeStyle!;
    this.ctx.lineCap = 'butt';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();

    // Starting Line
    this.ctx.moveTo(0, this.yAxis);
    this.ctx.lineTo(this.waveLeft, this.yAxis);

    let point: Point;

    for (let i = 0; i < this.waveWidth; i += options.segmentLength!) {
      // Calculate where the next point is
      point = this.getPoint(time, i, options);

      // Draw to it
      this.ctx.lineTo(point.x, point.y);
    }

    // Ending Line
    this.ctx.lineTo(this.width, this.yAxis);

    // Stroke it
    this.ctx.stroke();
  }

  /**
   * Animation Loop Controller
   */
  loop(): void {
    if (this.running === true) {
      this.update();
    }

    if (!this.options.manualUpdate) {
      this.animationId = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  /**
   * Cancel Loop
   */
  cancel(): void {
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Make the Wave functions available
   */
  Waves = Waves;

  /**
   * Make the Ease functions available
   */
  Ease = Ease;
}
