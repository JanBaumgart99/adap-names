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
        const comps = this.parseInternalName();
        return comps[i];
    }

    public setComponent(i: number, c: string): void {
        const comps = this.parseInternalName();
        comps[i] = c;
        this.rebuildFromComponents(comps);
    }

    public insert(i: number, c: string): void {
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
        const comps = this.parseInternalName();
        comps.splice(i, 1);
        this.rebuildFromComponents(comps);
    }

    //
    // ----- Private Helpers -----
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
                // Take next char literally
                if (i + 1 < this.name.length) {
                    cur += this.name[i + 1];
                    i++;
                } else {
                    // Trailing escape
                    cur += esc;
                }
            } else if (ch === d) {
                // Component boundary
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
