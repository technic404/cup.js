const CJS_ID_LENGTH = 16;

const CJS_PRETTY_PREFIX = `${Colors.Yellow}${Colors.Underscore}[CJS]${Colors.None} `;
const CJS_PRETTY_PREFIX_X = `${CJS_PRETTY_PREFIX}${Colors.Red}✘ ${Colors.None}`;
const CJS_PRETTY_PREFIX_V = `${CJS_PRETTY_PREFIX}${Colors.Green}✔ ${Colors.None}`;

const CJS_PREFIX = "c_js-";

const CJS_STYLE_PREFIX = `${CJS_PREFIX}style-`;
const CJS_STYLE_FILTERS_PREFIX = `${CJS_PREFIX}filters-`
const CJS_STYLE_KEYFRAMES_PREFIX = `${CJS_PREFIX}keyframes-`
const CJS_ROOT_CONTAINER_PREFIX = `${CJS_PREFIX}root-`;
const CJS_COMPONENT_PREFIX = `${CJS_PREFIX}component-`
const CJS_PART_PREFIX = `${CJS_PREFIX}part-`
const CJS_PART_TEXT_FIELD_PREFIX = `${CJS_PREFIX}parttextfield-`
const CJS_ELEMENT_PREFIX = `${CJS_PREFIX}element-`
const CJS_OBSERVER_PREFIX = `${CJS_PREFIX}observer-`
const CJS_REFERENCE_PREFIX = `${CJS_PREFIX}reference-`

const EVENTS_NAME_LIST = [
    "onabort",
    "onautocomplete",
    "onautocompleteerror",
    "onafterprint",
    "onbeforeprint",
    "onbeforeunload",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragexit",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "onformdata",
    "onfullscreenchange",
    "onfullscreenerror",
    "ongotpointercapture",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onlanguagechange",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onlostpointercapture",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpause",
    "onplay",
    "onplaying",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerup",
    "onpopstate",
    "onprogress",
    "onratechange",
    "onreset",
    "onresize",
    "onscroll",
    "onsearch",
    "onseeked",
    "onseeking",
    "onselect",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "ontouchcancel",
    "ontouchend",
    "ontouchmove",
    "ontouchstart",
    "ontransitioncancel",
    "ontransitionend",
    "ontransitionrun",
    "ontransitionstart",
    "onvolumechange",
    "onwaiting",
    "onwheel"
];
