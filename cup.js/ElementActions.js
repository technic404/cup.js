class CjsEvent {
    /**
     *
     * @param {Event|ChangesObserverEvent} event
     * @param {HTMLElement} component nearest component html element
     * @param {HTMLElement} part nearest part html element
     * @param {HTMLElement} source element to witch the event was applied
     * @param {Object} data
     */
    constructor(event, component, part, source, data) {
        this.event = event;
        this.target = event.target;
        this.component = component;
        this.part = part;
        this.source = source;
        this.data = data;
    }
}

function cjsEventFunction(f, event, sourceElement, data) {
    f(new CjsEvent(
        event,
        findParentThatHasAttribute(sourceElement, CJS_COMPONENT_PREFIX),
        findParentThatHasAttribute(sourceElement, CJS_PART_PREFIX),
        sourceElement,
        data
    ));
}

/**
 * Executes when clicked on the element
 * @param {function(CjsEvent)} f
 */
function onClick(f) {
    return functionMappings.add("click", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when mouse enter the element
 * @param {function(CjsEvent)} f
 */
function onMouseenter(f) {
    return functionMappings.add("mouseenter", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when mouse leave the element
 * @param {function(CjsEvent)} f
 */
function onMouseleave(f) {
    return functionMappings.add("mouseleave", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

/**
 * Executes when double clicked on the element
 * @param {function(CjsEvent)} f
 */
function onDblclick(f) {
    return functionMappings.add("dblclick", (event, element, data) => { cjsEventFunction(f, event, element, data); });
}

// TODO add outerclick lock and unlock detection separate from click event
// extra event
/**
 * Executes when clicked outside of the element
 * @param {function(CjsEvent)} f
 */
function onOuterclick(f) {
    return functionMappings.add("click", (event, element, data) => {
        if(!document.body.contains(element)) return;

        if(element !== event.target && !element.contains(event.target)) {
            cjsEventFunction(f, event, element, data);
        }
    }, { windowApplied: true });
}

/**
 * Executes when element is being loaded into website
 * @param {function(CjsEvent)} f
 */
function onLoad(f) {
    return changesObserver.listen("add", f);
}