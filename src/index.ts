/************************************************
 * @file  Entry point for sine-waves library
 * @author  Isaac Suttell
 ************************************************/

// Export main class
export { SineWaves as default, SineWaves } from './sine-waves';

// Export types and interfaces
export type { Point, WaveOptions, SineWavesOptions } from './sine-waves';
export type { EaseFunction, EaseFunctions } from './ease';
export type { WaveFunction, WaveFunctions } from './waves';

// Export objects
export { Ease } from './ease';
export { Waves } from './waves';

// Export constants
export { PI180, PI2, HALFPI } from './constants';

// Export utilities
export * from './utilities';
