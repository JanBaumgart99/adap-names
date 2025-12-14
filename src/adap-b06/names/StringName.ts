import { ESCAPE_CHARACTER, DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source string must not be null or undefined"
        );

        this.name = source;
        this.noComponents = this.parseComponents(source).length;
    }

    // ---------- CLONE SUPPORT ----------

    protected newInstance(): StringName {
        return new StringName(this.name, this.delimiter);
    }

    // ---------- PRIMITIVE OPERATIONS ----------

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of bounds"
        );
        return this.parseComponents(this.name)[i];
    }

    public setComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of bounds");

        const comps = this.parseComponents(this.name);
        comps[i] = c;
        const result = new StringName(comps.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(result.getComponent(i) === c, "setComponent failed");
        return result;
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "index out of bounds");

        const comps = this.parseComponents(this.name);
        comps.splice(i, 0, c);
        const result = new StringName(comps.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(result.getComponent(i) === c, "insert failed");
        return result;
    }

    public append(c: string): Name {
        const comps = this.parseComponents(this.name);
        comps.push(c);

        const result = new StringName(comps.join(this.delimiter), this.delimiter);
        MethodFailedException.assert(
            result.getComponent(result.getNoComponents() - 1) === c,
            "append failed"
        );
        return result;
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of bounds");

        const comps = this.parseComponents(this.name);
        comps.splice(i, 1);
        return new StringName(comps.join(this.delimiter), this.delimiter);
    }

    // ---------- HELPER ----------

    private parseComponents(value: string): string[] {
        if (value === "") return [];

        const comps: string[] = [];
        let current = "";
        let escaping = false;

        for (const ch of value) {
            if (escaping) {
                current += ch;
                escaping = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaping = true;
                continue;
            }
            if (ch === this.delimiter) {
                comps.push(current);
                current = "";
                continue;
            }
            current += ch;
        }

        comps.push(current);
        return comps;
    }
}
