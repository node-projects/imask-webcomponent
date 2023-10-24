import IMask from 'imask';
import { css, parseAttributesToProperties, restoreUnpgradedProperties } from './WebcomponentHelper.js';

export class IMaskWebcomponent extends HTMLElement {

    public static style = css`
        :host {
            font: inherit;
            position: relative;
            display: inline-block;
        }
        input {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: absolute;
        }
    `
    public static readonly is = 'node-projects-imask';

    public static properties = {
        mask: String,
        overwrite: String,
        placeholderChar: String,
        displayChar: String,
        lazy: Boolean,
        value: String
    }

    #initialLoad = true;
    #input: HTMLInputElement;

    #mask: string;
    public get mask() {
        return this.#mask;
    }
    public set mask(value) {
        this.#mask = value;
        this.refreshIMask();
    }

    #overwrite: 'shift' | boolean = false;
    public get overwrite() {
        return this.#overwrite;
    }
    public set overwrite(value) {
        this.#overwrite = value;
        this.refreshIMask();
    }

    #placeholderChar: string = '_';
    public get placeholderChar() {
        return this.#placeholderChar;
    }
    public set placeholderChar(value) {
        this.#placeholderChar = value;
        this.refreshIMask();
    }

    #displayChar: string = null;
    public get displayChar() {
        return this.#displayChar;
    }
    public set displayChar(value) {
        this.#displayChar = value;
        this.refreshIMask();
    }

    #lazy: boolean = false;
    public get lazy() {
        return this.#lazy;
    }
    public set lazy(value) {
        this.#lazy = value;
        this.refreshIMask();
    }

    #value: string = null;
    public get value() {
        return this.#input.value;
    }
    public set value(value) {
        this.#value = value;
        this.#input.value = value;
    }

    constructor() {
        super();
        restoreUnpgradedProperties(this)

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [IMaskWebcomponent.style];
        this.#input = document.createElement('input');
        this.shadowRoot.appendChild(this.#input);

        if (this.#value)
            this.#input.value = this.#value;
    }

    connectedCallback() {
        if (this.#initialLoad) {
            parseAttributesToProperties(this);
            this.#initialLoad = false;
            this.refreshIMask();
        }
    }

    disconnectedCallback() {
    }

    refreshIMask() {
        if (!this.#initialLoad) {
            IMask(this.#input, {
                mask: this.#mask,
                overwrite: this.#overwrite,
                placeholderChar: this.#placeholderChar,
                displayChar: this.#displayChar,
                lazy: this.lazy
            });
        }
    }
}

customElements.define(IMaskWebcomponent.is, IMaskWebcomponent);