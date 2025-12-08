import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];



    //  CONSTRUCTOR

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source array is null or undefined"
        );

        super(delimiter);

        // shallow copy
        this.components = [...source];

        this.assertInvariant();
    }



    //  CLONE SUPPORT

    protected getCloneData(components: string[]): object {
        return {
            components: {
                value: components.slice(),
                writable: true,
                enumerable: true
            }
        };
    }



    //  PRIMITIVE OPERATIONS (Narrow Interface)

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        this.components[i] = c;

        MethodFailedException.assert(
            this.components[i] === c,
            "setComponent(): component was not updated"
        );

        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertIsValidInsertIndex(i);
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();

        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "insert(): component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.components[i] === c,
            "insert(): component not inserted correctly"
        );

        this.assertInvariant();
    }

    public append(c: string): void {
        this.assertIsValidComponent(c);

        const oldCount = this.getNoComponents();
        this.components.push(c);

        MethodFailedException.assert(
            this.getNoComponents() === oldCount + 1,
            "append(): component count did not increase by 1"
        );
        MethodFailedException.assert(
            this.components[this.components.length - 1] === c,
            "append(): component not appended correctly"
        );

        this.assertInvariant();
    }

    public remove(i: number): void {
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();
        const removed = this.components[i];

        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.getNoComponents() === oldCount - 1,
            "remove(): component count did not decrease by 1"
        );
        MethodFailedException.assert(
            removed !== undefined,
            "remove(): removed component mismatch"
        );

        this.assertInvariant();
    }
}
