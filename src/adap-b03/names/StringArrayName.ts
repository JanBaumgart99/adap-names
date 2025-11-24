import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source ? [...source] : [];
    }

    //
    // ----- Helper Method  -----
    //

    protected assertIndex(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} out of bounds`);
        }
    }

    //
    // ----- Clone -----
    //

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    //
    // ----- Primitive Methods -----
    //

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.assertIndex(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertIndex(i);
        this.components.splice(i, 1);
    }
}