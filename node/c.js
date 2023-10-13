const fs = require("fs");
const { changeFirstLetterCapitalization } = require("./src/utils/string");

const ElementTypes = {
    COMPONENT: "component",
    PART: "part",
    LAYOUT: "layout",
    HANDLER: "handler"
}

/**
 *
 * @param {Object} nameObject
 * @param {String} nameObject.pascalCase
 * @param {String} nameObject.camelStyle
 * @param {$ElementType} elementType
 * @return {string}
 */
function getSchematic(nameObject, elementType) {
    return fs.readFileSync(`./schematics/${elementType}.txt`, 'utf-8')
        .replaceAll("{PascalCase}", nameObject.pascalCase)
        .replaceAll("{CamelStyle}", nameObject.camelStyle);
}

function command() {
    if (process.argv.length !== 4) {
        return console.error(`node loader.js [${Object.values(ElementTypes).join("/")}] [name]`);
    }

    const elementType = process.argv[2].toLowerCase();

    if(!Object.values(ElementTypes).includes(elementType)) {
        return console.error(`Wrong element name, available elements: ${Object.values(ElementTypes).join(", ")}`)
    }

    const rawName = process.argv[3];
    const hasWrongEnding = rawName.toLowerCase().endsWith(elementType);
    const parsedName = (
        hasWrongEnding ?
            rawName.substring(0, rawName.length - elementType.length) :
            rawName
    );

    if(hasWrongEnding) {
        console.warn(`Name contains wrong ending, parsed ${changeFirstLetterCapitalization(elementType, true)} with name "${rawName}" to "${parsedName}"`)
    }

    const name = {
        camelStyle: changeFirstLetterCapitalization(parsedName, false),
        pascalCase: changeFirstLetterCapitalization(parsedName, true)
    };

    const schematic = getSchematic(name, elementType);
    const elementFolder = `../src/${elementType}s/${name.camelStyle}`;

    if(!fs.existsSync(elementFolder)) {
        fs.mkdirSync(elementFolder, { recursive: true })
    }

    switch(elementType) {
        case ElementTypes.COMPONENT:
            const componentPath = `${elementFolder}/${name.pascalCase}Component.mjs`;
            const componentStylePath = `${elementFolder}/${name.pascalCase}Style.css`;
            const componentHandlerPath = `${elementFolder}/${name.pascalCase}Handler.mjs`;

            if(!fs.existsSync(componentPath)) { fs.writeFileSync(componentPath, schematic); }
            if(!fs.existsSync(componentStylePath)) { fs.writeFileSync(componentStylePath, ''); }
            if(!fs.existsSync(componentHandlerPath)) { fs.writeFileSync(componentHandlerPath, getSchematic(name, ElementTypes.HANDLER)); }

            break;
        case ElementTypes.PART:
            const partPath = `${elementFolder}/${name.pascalCase}Part.mjs`;
            const partStylePath = `${elementFolder}/${name.pascalCase}Style.css`;
            const partHandlerPath = `${elementFolder}/${name.pascalCase}Handler.mjs`;

            if(!fs.existsSync(partPath)) { fs.writeFileSync(partPath, schematic); }
            if(!fs.existsSync(partStylePath)) { fs.writeFileSync(partStylePath, ''); }
            if(!fs.existsSync(partHandlerPath)) { fs.writeFileSync(partHandlerPath, getSchematic(name, ElementTypes.HANDLER)); }
            break;
        case ElementTypes.LAYOUT:
            const layoutPath = `${elementFolder}/${name.pascalCase}Layout.mjs`;

            if(!fs.existsSync(layoutPath)) { fs.writeFileSync(layoutPath, schematic); }
            break;
    }

    console.log(`Created ${elementType} element`)
}

command();