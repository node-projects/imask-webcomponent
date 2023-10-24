/* Helpers for easier webcomponent creation */

function toParString(strings: TemplateStringsArray, values: any[]) {
    if (strings.length === 1)
        return strings.raw[0];
    else {
        let r = ''
        for (let i = 0; i < strings.length; i++) {
            r += strings[i] + (values[i] ?? '');
        }
        return r;
    }
}

export const html = (strings: TemplateStringsArray, ...values: any[]): HTMLTemplateElement => {
    const template = document.createElement('template');
    template.innerHTML = toParString(strings, values);
    return template;
};

export const css = (strings: TemplateStringsArray, ...values: any[]): CSSStyleSheet => {
    const cssStyleSheet = new CSSStyleSheet();
    cssStyleSheet.replaceSync(toParString(strings, values));
    return cssStyleSheet;
};

export const restoreUnpgradedProperties = (instance: any) => {
    for (let p in instance.constructor.properties) {
        if (instance.hasOwnProperty(p)) {
            const val = instance[p]
            delete instance[p];
            instance[p] = val;
        }
    }
}

export const parseAttributesToProperties = (instance: any) => {
    if (!instance.constructor._propertiesDictionary) {
        instance.constructor._propertiesDictionary = new Map<string, [string, any]>();
        for (let i in instance.constructor.properties) {
            instance.constructor._propertiesDictionary.set(i.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`), [i, instance.constructor.properties[i]]);
        }
    }
    for (const a of instance.attributes) {
        let pair = instance.constructor._propertiesDictionary.get(a.name);
        if (pair) {
            if (pair[1] === Boolean)
                instance[pair[0]] = true;
            else if (pair[1] === Object)
                instance[pair[0]] = JSON.parse(a.value);
            else if (pair[1] === Number)
                instance[pair[0]] = parseFloat(a.value);
            else
                instance[pair[0]] = a.value;
        }
    }
}