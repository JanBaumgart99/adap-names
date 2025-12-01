import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ESCAPE_CHARACTER } from "../common/Printable";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];



    //  Constructor
    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "Source array must not be null or undefined"
        );

        super(delimiter);

        // defensive copy
        this.components = source.slice();

        // validate each component masking
        for (let i = 0; i < this.components.length; i++) {
            IllegalArgumentException.assert(
                this.components[i] !== null && this.components[i] !== undefined,
                `Component at index ${i} must not be null or undefined`
            );
            this.validateMasking(this.components[i]);
        }

        this.assertInvariant();
    }



    //  clone()
    public clone(): Name {
        this.assertInvariant();

        const clone = new StringArrayName([...this.components], this.delimiter);

        MethodFailedException.assert(
            clone.isEqual(this),
            "Clone must equal original"
        );

        return clone;
    }



    //  Primitive methods 
    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        this.validateMasking(c);

        this.components[i] = c;

        MethodFailedException.assert(
            this.components[i] === c,
            "Postcondition failed: component was not correctly set"
        );

        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertValidInsertIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        this.validateMasking(c);

        const oldSize = this.components.length;

        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.components.length === oldSize + 1 &&
            this.components[i] === c,
            "Postcondition failed: insert did not work correctly"
        );

        this.assertInvariant();
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        this.validateMasking(c);

        const oldSize = this.components.length;

        this.components.push(c);

        MethodFailedException.assert(
            this.components.length === oldSize + 1 &&
            this.components[this.components.length - 1] === c,
            "Postcondition failed: append did not work correctly"
        );

        this.assertInvariant();
    }

    public remove(i: number): void {
        this.assertValidIndex(i);

        const oldSize = this.components.length;

        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.components.length === oldSize - 1,
            "Postcondition failed: remove did not remove exactly one component"
        );

        this.assertInvariant();
    }



    //  Masking validation (same concept as in StringName)
    private validateMasking(component: string): void {
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER) {
                IllegalArgumentException.assert(
                    i + 1 < component.length,
                    "Component contains dangling escape character"
                );
                i += 2;
            } else {
                IllegalArgumentException.assert(
                    component[i] !== this.delimiter,
                    "Component contains unmasked delimiter"
                );
                i++;
            }
        }
    }



    //  Index checks (protected because AbstractName also uses helpers)
    protected assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            `Index ${i} out of bounds`
        );
    }

    protected assertValidInsertIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            `Insert index ${i} out of bounds`
        );
    }



    //  Invariant extension
    protected assertInvariant(): void {
        super.assertInvariant();

        // All components must be valid
        for (let i = 0; i < this.components.length; i++) {
            InvalidStateException.assert(
                this.components[i] !== null && this.components[i] !== undefined,
                `Invariant violated: component at index ${i} is null or undefined`
            );
        }
    }
}
