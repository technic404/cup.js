class Reference {
    constructor() {
        this.id = `${CJS_REFERENCE_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
    }

    /**
     * Returns element in with reference was pasted
     * @return {Element}
     */
    getElement() {
        return document.body.querySelector(`[${this.id}='']`);
    }

    insert(html) {
        this.getElement().innerHTML = html;

        functionMappings.applyBodyMappings(); // TODO change in append functions to applyElementMappingFunction
    }

    clearContent() {
        this.insert('');
    }

    appendBefore(html) {
        this.getElement().insertAdjacentHTML(`afterbegin`, html);

        functionMappings.applyBodyMappings();
    }

    appendAfter(html) {
        this.getElement().insertAdjacentHTML(`beforeend`, html);

        functionMappings.applyBodyMappings();
    }

    appendElement(element) {
        const appendReferenceElements = () => {
            this.getElement().insertAdjacentElement(`beforeend`, element);

            for(const child of [element, ...element.querySelectorAll("*")]) {
                functionMappings.applyElementMappingFunction(child, true);
            }
        }

        // check on that, status complete is when all images and assets are loaded on website
        // we can try to bypass that assets (like images) loading and just start loading
        if(["complete"].includes(document.readyState)) {
            appendReferenceElements();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                appendReferenceElements();
            });
        }
    }

    /**
     *
     * @param {Element[]} elements
     */
    appendElements(elements) {
        elements.forEach(element => { this.appendElement(element); });
    }

    clear() {
        this.getElement().innerHTML = ``;
    }

    toString() {
        return ` ${this.id} `;
    }
}