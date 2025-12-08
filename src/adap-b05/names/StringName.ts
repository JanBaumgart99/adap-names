import { ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;



    //  CONSTRUCTOR

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source string is null or undefined"
        );

        super(delimiter);

        this.name = source;
        this.noComponents = this.parseComponents().length;

        this.assertInvariant();
    }



    //  CLONE SUPPORT for AbstractName.clone()

    protected getCloneData(components: string[]): object {
        return {
            name: {
                value: components.join(this.delimiter),
                writable: true,
                enumerable: true
            },
            noComponents: {
                value: components.length,
                writable: true,
                enumerable: true
            }
        };
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }



    //  PRIMITIVE OPERATIONS

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.parseComponents()[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const comps = this.parseComponents();
        comps[i] = c;

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.getComponent(i) === c,
            "setComponent(): component was not updated"
        );

        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertIsValidInsertIndex(i);
        this.assertIsValidComponent(c);

        const oldCount = this.noComponents;

        const comps = this.parseComponents();
        comps.splice(i, 0, c);

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "insert(): component count was not increased by 1"
        );
        MethodFailedException.assert(
            this.getComponent(i) === c,
            "insert(): component was not inserted correctly"
        );

        this.assertInvariant();
    }

    public append(c: string): void {
        this.assertIsValidComponent(c);

        const oldCount = this.noComponents;
        const comps = this.parseComponents();
        comps.push(c);

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === oldCount + 1,
            "append(): component count was not increased by 1"
        );
        MethodFailedException.assert(
            this.getComponent(this.noComponents - 1) === c,
            "append(): component not appended correctly"
        );

        this.assertInvariant();
    }

    public remove(i: number): void {
        this.assertIsValidIndex(i);

        const oldCount = this.noComponents;
        const comps = this.parseComponents();

        comps.splice(i, 1);

        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === oldCount - 1,
            "remove(): component count did not decrease by 1"
        );

        this.assertInvariant();
    }



    //  INTERNAL PARSING + STATE REBUILDING

    private parseComponents(): string[] {
        if (this.name === "") return [];

        const comps: string[] = [];
        let cur = "";
        let escaping = false;

        for (const ch of this.name) {
            if (escaping) {
                cur += ch;
                escaping = false;
                continue;
            }
            if (ch === ESCAPE_CHARACTER) {
                escaping = true;
                continue;
            }
            if (ch === this.delimiter) {
                comps.push(cur);
                cur = "";
                continue;
            }
            cur += ch;
        }

        comps.push(cur);
        return comps;
    }

    private rebuildFromComponents(components: string[]): void {
        this.noComponents = components.length;
        this.name = components.join(this.delimiter);
    }
}
