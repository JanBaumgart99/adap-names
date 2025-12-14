import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            delimiter !== undefined && delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER,
            "Invalid delimiter"
        );
        this.delimiter = delimiter;
        this.assertInvariant();
    }

    // ---------------- CLONE ----------------

    public clone(): Name {
        return this.newInstance();
    }

    protected abstract newInstance(): AbstractName;

    // ---------------- STRING ----------------

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter !== undefined && delimiter.length === 1,
            "Invalid delimiter"
        );

        let parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.unmask(this.getComponent(i)));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    // ---------------- EQUALITY ----------------

    public isEqual(other: Name): boolean {
        if (other === this) return true;
        if (!other) return false;

        if (this.getNoComponents() !== other.getNoComponents()) return false;
        if (this.delimiter !== other.getDelimiterCharacter()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    // ---------------- QUERIES ----------------

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // ---------------- CONCAT ----------------

    public concat(other: Name): Name {
        let result: Name = this.clone();
        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.append(other.getComponent(i));
        }
        return result;
    }

    // ---------------- HELPERS ----------------

    protected unmask(component: string): string {
        let res = "";
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                res += component[i + 1];
                i += 2;
            } else {
                res += component[i++];
            }
        }
        return res;
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(
            this.delimiter.length === 1,
            "Invalid state: delimiter"
        );
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "Invalid state: negative component count"
        );
    }

    // ---------------- NARROW INTERFACE ----------------

    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;

    public abstract setComponent(i: number, c: string): Name;
    public abstract insert(i: number, c: string): Name;
    public abstract append(c: string): Name;
    public abstract remove(i: number): Name;
}
