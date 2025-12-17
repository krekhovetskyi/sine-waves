/************************************************
 * @file  General utility functions
 * @author  Isaac Suttell
 ************************************************/

import { PI180 } from './constants';

/**
 * Checks to see if a var is a specified type
 *
 * @param  {any}  obj  var to check
 * @param  {string}  type  type to check
 *
 * @return {boolean}
 */
export function isType(obj: any, type: string): boolean {
  const result = {}.toString.call(obj).toLowerCase();
  return result === '[object ' + type.toLowerCase() + ']';
}

/**
 * Checks to see if a var is a function
 *
 * @param  {any}  fn  var to check
 *
 * @return {boolean}
 */
export function isFunction(fn: any): fn is Function {
  return isType(fn, 'function');
}

/**
 * Checks to see if a var is a string
 *
 * @param  {any}  str  var to check
 *
 * @return {boolean}
 */
export function isString(str: any): str is string {
  return isType(str, 'string');
}

/**
 * Checks to see if a var is a number
 *
 * @param  {any}  num  var to check
 *
 * @return {boolean}
 */
export function isNumber(num: any): num is number {
  return isType(num, 'number');
}

/**
 * Create a clone of an object
 *
 * @param  {T} src Object to clone
 *
 * @return {T}
 */
export function shallowClone<T extends Record<string, any>>(src: T): T {
  const dest: any = {};
  for (const i in src) {
    if (src.hasOwnProperty(i)) {
      dest[i] = src[i];
    }
  }
  return dest;
}

/**
 * Basic Extend Function
 *
 * @param     {T}    dest   object to fill
 * @param     {Partial<T>}    src    object to copy
 *
 * @return    {T}
 */
export function defaults<T extends Record<string, any>>(dest: T, src: Partial<T> | any): T {
  if (!isType(src, 'object')) {
    src = {};
  }
  const clone = shallowClone(dest);
  for (const i in src) {
    if (src.hasOwnProperty(i)) {
      (clone as any)[i] = src[i];
    }
  }
  return clone;
}

/**
 * Convert degrees to radians for rotation function
 *
 * @param     {number}    degrees
 *
 * @return    {number}
 */
export function degreesToRadians(degrees: number): number {
  if (!isType(degrees, 'number')) {
    throw new TypeError('Degrees is not a number');
  }
  return degrees * PI180;
}

/**
 * You can either directly specify a easing function, use a built in function
 * or default to the basic SineInOut
 *
 * @param     {T}   obj     Object to search in
 * @param     {string | Function}    name    String || Function
 * @param     {keyof T}   def     Default function
 *
 * @return    {Function}
 */
export function getFn<T extends Record<string, any>>(
  obj: T,
  name: string | Function,
  def: keyof T
): Function {
  if (isFunction(name)) {
    return name;
  } else if (isString(name) && isFunction(obj[name.toLowerCase()])) {
    return obj[name.toLowerCase()];
  } else {
    return obj[def];
  }
}
