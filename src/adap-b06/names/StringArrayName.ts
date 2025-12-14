import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected readonly components: string[];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source array must not be null or undefined"
        );

        // defensive copy
        this.components = [...source];
    }



    //  CLONE SUPPORT 

    protected newInstance(): StringArrayName {
        return new StringArrayName([...this.components], this.delimiter);
    }



    //  PRIMITIVE OPERATIONS 

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );
        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const newComps = [...this.components];
        newComps[i] = c;

        const result = new StringArrayName(newComps, this.delimiter);
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "setComponent failed"
        );

        return result;
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            "index out of bounds"
        );

        const newComps = [...this.components];
        newComps.splice(i, 0, c);

        const result = new StringArrayName(newComps, this.delimiter);
        MethodFailedException.assert(
            result.getComponent(i) === c,
            "insert failed"
        );

        return result;
    }

    public append(c: string): Name {
        const newComps = [...this.components, c];

        const result = new StringArrayName(newComps, this.delimiter);
        MethodFailedException.assert(
            result.getComponent(result.getNoComponents() - 1) === c,
            "append failed"
        );

        return result;
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const newComps = [...this.components];
        newComps.splice(i, 1);

        return new StringArrayName(newComps, this.delimiter);
    }
}
