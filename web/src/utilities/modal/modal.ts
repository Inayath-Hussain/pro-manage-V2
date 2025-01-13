/**
 * 
 * @returns array of visible focusable elements 
 */
export const getAllFocusableElements = (div: HTMLDivElement) => {

    // selects all focusable elements in the given div
    const focusableElements = div.querySelectorAll('button, input, href, textarea, select, [tabIndex]:not([tabIndex="-1"])');

    // array of all visible elements
    const visibleFocusableElements: HTMLElement[] = [];

    focusableElements.forEach(element => {
        if (element.checkVisibility()) visibleFocusableElements.push(element as HTMLElement)
    })

    return visibleFocusableElements;
}