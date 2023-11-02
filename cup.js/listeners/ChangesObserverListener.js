class ChangesObserverEvent {
    /**
     *
     * @param {HTMLElement} target
     * @param {Date} date
     */
    constructor(target, date) {
        this.target = target;
        this.date = date;
    }
}

class ChangesObserverListener {
    constructor() {
        this.map = new Map(); // attribute, { type: string, action: function, data: object }
        this.executedFunctions = new Map(); // attribute, { element: HTMLElement }
    }

    /**
     *
     * @param {"add"|"remove"} type
     * @param {function(CjsEvent)} f function to execute when changes observer detects the trigger
     * @returns {String} attribute
     */
    listen(type, f) {
        if(!["add", "remove"].includes(type)) {
            console.log(`${CJS_PRETTY_PREFIX_X}The 'type' param should be 'add' or 'remove'`)
            return null;
        }

        let attribute = null;

        while (this.map.has(attribute) || attribute === null) {
            attribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        this.map.set(attribute, { type: type, action: f, data: {} });

        return ` ${attribute} `;
    }

    /**
     *
     * @param {String} attribute
     * @return {String|Null} new attribute
     */
    cloneAttribute(attribute) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Map does not contain the attribute ${attribute}`);

            return null;
        }

        let newAttribute = null;

        while (this.map.has(newAttribute) || newAttribute === null) {
            newAttribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        const obj = Object.assign({}, this.map.get(attribute));

        this.map.set(newAttribute, obj);

        return newAttribute;
    }

    replaceAttribute(element, oldAttribute, newAttribute) {
        element.removeAttribute(oldAttribute);
        element.setAttribute(newAttribute, "");
    }

    /**
     * Observer needs to reload attributes
     * @param {String} attribute
     * @param {Object} data
     * @returns {String|Null}
     */
    setData(attribute, data) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided attribute does not exists`)
            return null;
        }

        const newAttribute = this.cloneAttribute(attribute);
        const obj = this.map.get(newAttribute);

        obj.data = data;

        return newAttribute;
    }

    /**
     *
     * @param {"add"|"remove"} type
     */
    executeAll(type) {
        for(const [attribute, obj] of this.map.entries()) {
            if(obj.type !== type) continue;

            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if(elements.length === 0) continue;

            elements.forEach(element => {
                this.execute(type, attribute, element);
            })
        }
    }

    /**
     *
     * @param {"add"|"remove"} type
     * @param {String} attribute
     * @param {HTMLElement|Node} element source element that has been changed
     */
    execute(type, attribute, element) {
        if(!this.map.has(attribute)) return;

        //const isPart = getAttributeStartingWith(element, CJS_PART_PREFIX).length > 0;
        //const isComponent = getAttributeStartingWith(element, CJS_COMPONENT_PREFIX).length > 0;
        const isRegistered = this.executedFunctions.has(attribute);

        if(isRegistered) {
            const registeredElementMatches = this.executedFunctions.get(attribute).element === element

            if(registeredElementMatches) return;

        }

        const obj = this.map.get(attribute);

        if(obj.type !== type) return;

        const cjsEvent = new CjsEvent(
            new ChangesObserverEvent(element, new Date()),
            findParentThatHasAttribute(element, CJS_COMPONENT_PREFIX),
            findParentThatHasAttribute(element, CJS_PART_PREFIX),
            element,
            Object.assign({}, obj.data)
        );

        obj.action(cjsEvent);

        if(!this.executedFunctions.has(attribute)) {
            this.executedFunctions.set(attribute, { element: element })
        }
    }
}

const changesObserver = new ChangesObserverListener();

const targetNode = document;

const mutationCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if(mutation.type !== 'childList') continue;

        mutation.addedNodes.forEach(addedNode => {
            // Convert Node to HTMLElement
            const element = document.createElement("div");
            element.appendChild(addedNode.cloneNode(true));

            for(const fictionChild of [element, ...element.querySelectorAll("*")]) {
                // Find all attributes in fiction HTMLElement
                const fictionChildAttributes = {
                    element: getAttributeStartingWith(fictionChild, CJS_ELEMENT_PREFIX),
                    observer: getAttributeStartingWith(fictionChild, CJS_OBSERVER_PREFIX)
                }

                // If there are no attributes just skip
                if (fictionChildAttributes.element.length === 0 && fictionChildAttributes.observer.length === 0) continue;

                // Loop through found attributes
                fictionChildAttributes.element.forEach(attribute => {
                    // Find real elements with that attribute
                    const documentChild = document.querySelectorAll(`[${attribute}='']`);

                    documentChild.forEach(child => {
                        // Allowing duplicates because of the child was added right now so it does not have any event yet
                        functionMappings.applyElementAttributeMappingFunction(child, attribute, true);
                    })
                });

                // Loop through found attributes
                fictionChildAttributes.observer.forEach(attribute => {
                    // Find real elements with that attribute
                    const documentChild = document.querySelectorAll(`[${attribute}='']`);

                    documentChild.forEach(child => {
                        changesObserver.execute("add", attribute, child);
                    })
                });
            }
        });

        mutation.removedNodes.forEach(removedNode => {
            const attributes = getAttributeStartingWith(removedNode, CJS_OBSERVER_PREFIX);

            attributes.forEach(attribute => {
                changesObserver.execute("remove", attribute, removedNode);
            })
        });
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(mutationCallback);
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);

    changesObserver.executeAll("add"); // executes missing onLoad functions inside elements, because some elements might have been loaded before DOMContentLoaded

})