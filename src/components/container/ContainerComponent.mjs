import {ContainerHandler} from "./ContainerHandler.mjs";

const Handler = new ContainerHandler();

export const ContainerComponent = createComponent(`
    <div
        ${onLoad(() => { setInterval(() => { console.log(CjsGlobals.mouse.state) }, 1000) })}
    >
        <button
            ${onClick((e) => { e.component.querySelector("p").innerText = `Clicked :)` })}
        >ClickEvent!</button>
        
        <div class="field"
            ${onClick(() => { console.log('clicked in!') })}
            ${onOuterclick(() => { console.log('clicked out!') })}
            ${onMouseenter(() => { Root.setCursor("pointer") })}
            ${onMouseleave(() => { Root.setCursor("default") })}
        >
            
        </div>
        
        <p></p>
    </div>
`);

ContainerComponent.importStyle('./src/components/container/ContainerStyle.css');

