/************************************************
 * @file  Sine Wave functions
 * @author Isaac Suttell
 ************************************************/

import { PI2 } from './constants';

/**
 * Wave function type
 */
export type WaveFunction = (x: number) => number;

/**
 * Interface for wave functions
 */
export interface WaveFunctions {
  sine: WaveFunction;
  sin: WaveFunction;
  sign: WaveFunction;
  square: WaveFunction;
  sawtooth: WaveFunction;
  triangle: WaveFunction;
  [key: string]: WaveFunction;
}

/**
 * Holds the different types of waves
 */
export const Waves: WaveFunctions = {
  /**
   * Default Sine Waves
   *
   * @param    {number}    x
   */
  sine: function(x: number): number {
    return Math.sin(x);
  },

  /**
   * Alias for Sine
   */
  sin: function(x: number): number {
    return Math.sin(x);
  },

  /**
   * Sign polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
   *
   * @param     {number}    x
   *
   * @return    {number}
   */
  sign: function(x: number): number {
    const num = +x; // convert to a number
    if (num === 0 || isNaN(num)) {
      return num;
    }
    return num > 0 ? 1 : -1;
  },

  /**
   * Square Waves
   *
   * @param    {number}    x
   */
  square: function(x: number): number {
    return Waves.sign(Math.sin(x * PI2));
  },

  /**
   * Sawtooth Waves
   *
   * @param    {number}    x
   */
  sawtooth: function(x: number): number {
    return (x - Math.floor(x + 0.5)) * 2;
  },

  /**
   * Triangle Waves
   *
   * @param    {number}    x
   */
  triangle: function(x: number): number {
    return Math.abs(Waves.sawtooth(x));
  }
};
