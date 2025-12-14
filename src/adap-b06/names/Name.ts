import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

export interface Name extends Cloneable, Printable, Equality {

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /**
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    getComponent(i: number): string;

    /** Expects that new Name component c is properly masked */
    setComponent(i: number, c: string): Name;

    /** Expects that new Name component c is properly masked */
    insert(i: number, c: string): Name;

    /** Expects that new Name component c is properly masked */
    append(c: string): Name;

    remove(i: number): Name;

    concat(other: Name): Name;
}
