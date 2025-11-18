import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }


    //
    // ----- Cloning (Subclasses must implement) -----
    //


    public abstract clone(): Name;


    //
    // ----- Stringification -----
    //


    public asString(delimiter: string = this.delimiter): string {
        // Escape delimiter and escape character in components
        const escape = (s: string) =>
            s.replace(
                new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, "g"),
                ch => ESCAPE_CHARACTER + ch
            );

        const parts: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(escape(this.getComponent(i)));
        }

        return parts.join(delimiter);
    }


    public toString(): string {
        return this.asDataString();
    }


    public asDataString(): string {
        // canonical, delimiter-independent representation
        return this.asString(DEFAULT_DELIMITER);
    }


    //
    // ----- Equality & Hashing -----
    //


    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }


    public getHashCode(): number {
        const str = this.asDataString();
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }

        return hash;
    }


    //
    // ----- Simple Queries -----
    //


    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }


    public getDelimiterCharacter(): string {
        return this.delimiter;
    }


    //
    // ----- Primitive (Inheritance Interface) -----
    // Subclasses must implement these (representation-specific)
    //


    public abstract getNoComponents(): number;

    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;


    //
    // ----- Mutation -----
    //


    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}