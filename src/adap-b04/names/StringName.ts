import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;



    //  Constructor
    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "Source string must not be null or undefined"
        );

        super(delimiter);

        const components = this.parseComponents(source, this.delimiter);
        this.rebuildFromComponents(components);

        this.assertInvariant();
    }



    //  clone()
    public clone(): Name {
        this.assertInvariant();

        const clone = new StringName(this.name, this.delimiter);

        MethodFailedException.assert(
            clone.isEqual(this),
            "Clone must equal original"
        );

        return clone;
    }



    //  Primitive methods
    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        const comps = this.getComponents();
        return comps[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        const comps = this.getComponents();
        comps[i] = c;

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.getComponent(i) === c,
            "Postcondition failed: setComponent did not apply component"
        );

        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertValidInsertIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        const comps = this.getComponents();
        comps.splice(i, 0, c);

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.getComponent(i) === c,
            "Postcondition failed: insert did not insert component"
        );

        this.assertInvariant();
    }



    public append(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        const comps = this.getComponents();
        comps.push(c);

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.getComponent(this.noComponents - 1) === c,
            "Postcondition failed: append did not append component"
        );

        this.assertInvariant();
    }



    public remove(i: number): void {
        this.assertValidIndex(i);

        const comps = this.getComponents();
        comps.splice(i, 1);

        this.rebuildFromComponents(comps);

        this.assertInvariant();
    }



    //  Helper: parse string into components
    private parseComponents(value: string, delimiter: string): string[] {
        if (value.length === 0) return [];

        const components: string[] = [];
        let current = "";
        let escaping = false;

        for (let i = 0; i < value.length; i++) {
            const ch = value[i];

            if (escaping) {
                current += ch;
                escaping = false;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                escaping = true;
                continue;
            }

            if (ch === delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += ch;
        }

        if (escaping) current += ESCAPE_CHARACTER;

        components.push(current);
        return components;
    }



    //  Helper: getComponents
    private getComponents(): string[] {
        if (this.noComponents === 0) return [];
        return this.parseComponents(this.name, this.delimiter);
    }



    //  Helper: rebuild component string
    private rebuildFromComponents(components: string[]): void {
        this.noComponents = components.length;

        if (components.length === 0) {
            this.name = "";
            return;
        }

        const escaped = components.map(c =>
            this.escapeComponent(c, this.delimiter)
        );

        this.name = escaped.join(this.delimiter);

        this.assertInvariant();
    }



    //  Index validators (using AbstractName logic)
    protected assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            `Index ${i} out of bounds`
        );
    }

    protected assertValidInsertIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.noComponents,
            `Insert index ${i} out of bounds`
        );
    }



    //  Additional invariant extension
    protected assertInvariant(): void {
        super.assertInvariant();

        if (this.noComponents === 0) {
            InvalidStateException.assert(
                this.name === "",
                "Empty names must not store a non-empty name string"
            );
        } else {
            const parsed = this.parseComponents(this.name, this.delimiter);
            InvalidStateException.assert(
                parsed.length === this.noComponents,
                "Stored component count mismatch"
            );
        }
    }
}
