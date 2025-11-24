import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source ?? "";
        this.noComponents = this.parseInternalName().length;
    }

    //
    // ----- Helper Methods-----
    //

    protected assertIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} out of bounds`);
        }
    }


    //
    // ----- Clone -----
    //

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    //
    // ----- Primitive Methods -----
    //

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIndex(i);
        const comps = this.parseInternalName();
        return comps[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIndex(i);
        const comps = this.parseInternalName();
        comps[i] = c;
        this.rebuildFromComponents(comps);
    }

    public insert(i: number, c: string): void {
        this.assertIndex(i);
        const comps = this.parseInternalName();
        comps.splice(i, 0, c);
        this.rebuildFromComponents(comps);
    }

    public append(c: string): void {
        const comps = this.parseInternalName();
        comps.push(c);
        this.rebuildFromComponents(comps);
    }

    public remove(i: number): void {
        this.assertIndex(i);
        const comps = this.parseInternalName();
        comps.splice(i, 1);
        this.rebuildFromComponents(comps);
    }

    //
    // ----- Private Parsing / Rebuild Helpers -----
    //

    private parseInternalName(): string[] {
        if (this.name.length === 0) return [];

        const d = this.delimiter;
        const esc = ESCAPE_CHARACTER;

        const components: string[] = [];
        let cur = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];

            if (ch === esc) {
                // escape character → escape next character
                if (i + 1 < this.name.length) {
                    cur += this.name[i + 1];
                    i++;
                } else {
                    cur += esc;
                }
            } else if (ch === d) {
                // delimiter → new component
                components.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }

        components.push(cur);
        return components;
    }

    private rebuildFromComponents(components: string[]): void {
        const esc = ESCAPE_CHARACTER;
        const d = this.delimiter;

        const masked = components.map(c =>
            c.replace(new RegExp(`[${esc}${d}]`, "g"), ch => esc + ch)
        );

        this.name = masked.join(this.delimiter);
        this.noComponents = components.length;
    }
}
