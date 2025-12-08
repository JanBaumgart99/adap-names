import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter);
        this.delimiter = delimiter;
        this.assertInvariant();
    }



    //  CLONING

    public clone(): Name {
        this.assertInvariant();

        const comps: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            comps.push(this.getComponent(i));
        }

        const clone = Object.create(
            Object.getPrototypeOf(this),
            {
                delimiter: { value: this.delimiter, writable: true, enumerable: true },
                ...this.getCloneData(comps)
            }
        );

        MethodFailedException.assert(
            clone.isEqual(this),
            "clone(): cloned object is not equal to original"
        );

        return clone;
    }

    protected abstract getCloneData(components: string[]): object;



    //  STRINGIFICATION

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsValidDelimiter(delimiter);
        this.assertInvariant();

        if (this.isEmpty()) return "";

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmasked = this.unmask(this.getComponent(i));
            parts.push(unmasked);
        }

        const result = parts.join(delimiter);

        MethodFailedException.assert(result !== null, "asString() produced null");
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertInvariant();

        if (this.isEmpty()) return "";

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const raw = this.unmask(this.getComponent(i));
            const escaped = this.mask(raw, DEFAULT_DELIMITER);
            parts.push(escaped);
        }

        const result = parts.join(DEFAULT_DELIMITER);

        MethodFailedException.assert(result !== null, "asDataString() produced null");
        return result;
    }



    //  EQUALITY & HASHING

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other !== null && other !== undefined, "other is null");

        if (this.getNoComponents() !== other.getNoComponents()) return false;
        if (this.delimiter !== other.getDelimiterCharacter()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;

        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }

        return hash;
    }



    //  SIMPLE QUERIES

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }



    //  MUTATION

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined, "other is null");

        this.assertInvariant();
        const before = this.getNoComponents();
        const add = other.getNoComponents();

        for (let i = 0; i < add; i++) {
            this.append(other.getComponent(i));
        }

        MethodFailedException.assert(
            this.getNoComponents() === before + add,
            "concat() failed: wrong component count"
        );

        this.assertInvariant();
    }



    //  MASKING HELPERS

    protected unmask(component: string): string {
        let res = "";
        let i = 0;

        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                res += component[i + 1];
                i += 2;
            } else {
                res += component[i];
                i++;
            }
        }
        return res;
    }

    protected mask(str: string, delimiter: string): string {
        let out = "";
        for (const ch of str) {
            if (ch === delimiter || ch === ESCAPE_CHARACTER) out += ESCAPE_CHARACTER;
            out += ch;
        }
        return out;
    }



    //  ARGUMENT CHECK HELPERS

    protected assertIsValidDelimiter(d: string): void {
        IllegalArgumentException.assert(d !== null && d !== undefined, "delimiter null");
        IllegalArgumentException.assert(typeof d === "string", "delimiter not a string");
        IllegalArgumentException.assert(d.length === 1, "delimiter must be a single char");
        IllegalArgumentException.assert(
            d !== ESCAPE_CHARACTER,
            "delimiter must not be ESCAPE_CHARACTER"
        );
    }

    protected assertIsValidComponent(c: any): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "component null");
        IllegalArgumentException.assert(typeof c === "string", "component must be string");
    }

    protected assertIsValidIndex(i: number): void {
        IllegalArgumentException.assert(Number.isInteger(i), "index not integer");
        IllegalArgumentException.assert(i >= 0, "index negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
    }

    protected assertIsValidInsertIndex(i: number): void {
        IllegalArgumentException.assert(Number.isInteger(i), "index not integer");
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), "insert index invalid");
    }



    //  INVARIANT

    protected assertInvariant(): void {
        InvalidStateException.assert(
            this.delimiter !== null && this.delimiter !== undefined && this.delimiter.length === 1,
            "Invariant violated: delimiter invalid"
        );

        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "Invariant violated: negative component count"
        );
    }



    //  NARROW INTERFACE

    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

}
