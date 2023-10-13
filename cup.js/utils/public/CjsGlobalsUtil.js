/**
 *
 * @type {{mouse: {up: boolean, state: "up"|"down", down: boolean}}}
 */
const CjsGlobals = {
    mouse: {
        up: true,
        down: false,
        state: "up"
    }
}

/* Mouse */
window.addEventListener('mousedown', () => { CjsGlobals.mouse = { up: false, down: true, state: "down" } })
window.addEventListener('mouseup', () => { CjsGlobals.mouse = { up: true, down: false, state: "up" } })