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

    setComponent(i: number, c: string): Name;

    insert(i: number, c: string): Name;

    append(c: string): Name;

    remove(i: number): Name;

    concat(other: Name): Name;
}
