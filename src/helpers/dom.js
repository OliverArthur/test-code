/**
 * Finds the closest parent with a given class name.
 * Returns null if no element found.
 *
 * @export
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {Node|null}
 */
export function closest(element, className) {
  while ((element = element.parentElement) && !element.classList.contains(className)) // eslint-disable-line
    return element
}
