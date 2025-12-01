import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

/**
 * Abstract base class for all Name implementations.
 * 
 * Subclasses ONLY implement the primitive representation methods:
 *   getNoComponents(), getComponent(), setComponent(), insert(), append(), remove()
 */

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;



    //  Constructor (with Preconditions & Invariant)
    constructor(delimiter: string = DEFAULT_DELIMITER) {

        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "Delimiter must not be null or undefined"
        );

        IllegalArgumentException.assert(
            delimiter.length === 1,
            "Delimiter must be exactly one character"
        );

        this.delimiter = delimiter;

        this.assertInvariant();
    }




    //  Invariant check 
    protected assertInvariant(): void {
        InvalidStateException.assert(
            this.delimiter !== null &&
            this.delimiter !== undefined &&
            this.delimiter.length === 1,
            "Invariant violated: delimiter invalid"
        );

        const n = this.getNoComponents();
        InvalidStateException.assert(n >= 0, "Invariant violated: negative component count");

        for (let i = 0; i < n; i++) {
            const comp = this.getComponent(i);
            InvalidStateException.assert(
                comp !== null && comp !== undefined,
                `Invariant violated: component at index ${i} is null/undefined`
            );
        }
    }



    //  Helper: index validation
    protected assertValidIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i < this.getNoComponents(),
            `Index ${i} out of bounds`
        );
    }

    protected assertValidInsertIndex(i: number): void {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.getNoComponents(),
            `Insert index ${i} out of bounds`
        );
    }



    //  Masking helpers
    protected escapeComponent(component: string, delimiter: string): string {

        IllegalArgumentException.assert(
            component !== null && component !== undefined,
            "Component must not be null or undefined"
        );

        let out = "";
        for (const ch of component) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                out += ESCAPE_CHARACTER;
            }
            out += ch;
        }
        return out;
    }

    protected unescapeComponent(component: string): string {
        let out = "";
        let i = 0;
        while (i < component.length) {
            const ch = component[i];
            if (ch === ESCAPE_CHARACTER && i + 1 < component.length) {
                out += component[i + 1];
                i += 2;
            } else {
                out += ch;
                i++;
            }
        }
        return out;
    }



    //  clone()
    public abstract clone(): Name;



    //  Conversions
    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "Delimiter must not be null or undefined"
        );
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "Delimiter must be exactly one character"
        );

        this.assertInvariant();

        const n = this.getNoComponents();
        if (n === 0) return "";

        const parts: string[] = [];

        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            parts.push(this.unescapeComponent(masked));
        }

        const result = parts.join(delimiter);

        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition failed: asString returned null/undefined"
        );

        this.assertInvariant();
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertInvariant();

        const n = this.getNoComponents();
        if (n === 0) return "";

        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            const raw = this.getComponent(i);
            const escaped = this.escapeComponent(raw, DEFAULT_DELIMITER);
            parts.push(escaped);
        }

        const result = parts.join(DEFAULT_DELIMITER);

        MethodFailedException.assert(
            result !== null && result !== undefined,
            "Postcondition failed: asDataString returned null/undefined"
        );

        this.assertInvariant();
        return result;
    }



    //  Equality & Hashing
    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "Other must not be null/undefined"
        );

        this.assertInvariant();

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        this.assertInvariant();
        return true;
    }

    public getHashCode(): number {
        this.assertInvariant();

        let hash = 0;
        const s = this.asDataString();

        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }

        this.assertInvariant();
        return hash;
    }



    //  Simple queries
    public isEmpty(): boolean {
        this.assertInvariant();

        const result = (this.getNoComponents() === 0);

        this.assertInvariant();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertInvariant();
        return this.delimiter;
    }



    //  Mutation with Contracts
    public concat(other: Name): void {
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "Other must not be null or undefined"
        );

        this.assertInvariant();

        const oldSize = this.getNoComponents();
        const otherSize = other.getNoComponents();

        for (let i = 0; i < otherSize; i++) {
            this.append(other.getComponent(i));
        }

        MethodFailedException.assert(
            this.getNoComponents() === oldSize + otherSize,
            "Postcondition failed: concat did not add correct number of components"
        );

        this.assertInvariant();
    }



    //  Narrow Inheritance Interface
    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;
}
