/************************************************
 * @file  Left to right easing functions
 * @author Isaac Suttell
 ************************************************/

import { HALFPI, PI2 } from './constants';

/**
 * Easing function type
 */
export type EaseFunction = (percent: number, amplitude: number) => number;

/**
 * Interface for easing functions
 */
export interface EaseFunctions {
  linear: EaseFunction;
  sinein: EaseFunction;
  sineout: EaseFunction;
  sineinout: EaseFunction;
  [key: string]: EaseFunction;
}

/**
 * This holds all of the easing objects and can be added to by the user
 */
export const Ease: EaseFunctions = {
  /**
   * Do not apply any easing
   *
   * @param  {number} percent   where in the line are we?
   * @param  {number} amplitude the current strength
   *
   * @return {number}           the new strength
   */
  linear: function(_percent: number, amplitude: number): number {
    return amplitude;
  },

  /**
   * Easing function to control how string each wave is from
   * left to right
   *
   * @param  {number} percent   where in the line are we?
   * @param  {number} amplitude the current strength
   *
   * @return {number}           the new strength
   */
  sinein: function(percent: number, amplitude: number): number {
    return amplitude * (Math.sin(percent * Math.PI - HALFPI) + 1) * 0.5;
  },

  /**
   * Easing function to control how string each wave is from
   * left to right
   *
   * @param  {number} percent   where in the line are we?
   * @param  {number} amplitude the current strength
   *
   * @return {number}           the new strength
   */
  sineout: function(percent: number, amplitude: number): number {
    return amplitude * (Math.sin(percent * Math.PI + HALFPI) + 1) * 0.5;
  },

  /**
   * Easing function to control how string each wave is from
   * left to right
   *
   * @param  {number} percent   where in the line are we?
   * @param  {number} amplitude the current strength
   *
   * @return {number}           the new strength
   */
  sineinout: function(percent: number, amplitude: number): number {
    return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5;
  }
};
