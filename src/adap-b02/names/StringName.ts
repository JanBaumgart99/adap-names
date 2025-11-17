import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    //Helper-Methode um sicherzustellen dass der Delimiter genau ein Zeichen lang ist.
    protected assertSingleCharacterCheck(d: string): void {
        if (d.length !== 1) {
            throw new Error("The Delimiter must be exactly one character");
        }
    }



    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.assertSingleCharacterCheck(delimiter);
            this.delimiter = delimiter;
        };

        this.name = source;
    }



    public asString(delimiter: string = this.delimiter): string {
        // Wenn der gesamte Name leer ist, dann gibt es keine Komponenten, also wird leerer String zurück gegeben.
        if (this.isEmpty()) {
            return "";
        }

        // Zerlegt den Namen
        const components = this.name.split(this.delimiter);

        // Baut die String Ausgabe mit dem Delimiter zusammen und gibt ihn zurück.
        return components.join(delimiter);
    }



    public asDataString(): string {
        if (this.isEmpty()) {
            return "";
        }

        // Zerlegt den Namen anhand des (gesetzten)) Delimiters.
        const components = this.name.split(this.delimiter);

        // DEFAULT_DELIMITER nutzen beim zusammensetzen.
        return components.join(DEFAULT_DELIMITER);
    }



    public getDelimiterCharacter(): string {
        return this.delimiter;
    }



    public isEmpty(): boolean {
        return this.name.length === 0;
    }



    public getNoComponents(): number {
        if (this.isEmpty()) {
            return 0;
        };

        const components = this.name.split(this.delimiter);

        return components.length
    }



    public getComponent(x: number): string {
        if (this.isEmpty()) {
            return "";
        };

        const components = this.name.split(this.delimiter);

        // Gibt die gewünschte Komponente zurück.
        return components[x];
    }



    public setComponent(n: number, c: string): void {
        // Falls der Name leer ist, gibt es nichts zu ersetzen.
        if (this.isEmpty()) {
            return;
        };

        const components = this.name.split(this.delimiter);

        // Ersetzt die Komponente an Index n.
        components[n] = c;

        // Baut den aktualisierten Namen wieder als String zusammen.
        this.name = components.join(this.delimiter);
    }



    public insert(n: number, c: string): void {
        // Wenn der Name bisher leer ist, wird es einfach zur ersten Komponente.
        if (this.isEmpty()) {
            this.name = c;
            return;
        };

        const components = this.name.split(this.delimiter);

        // Fügt die neue Komponente an der gewünschten Stelle ein.
        components.splice(n, 0, c);

        // Baut den aktualisierten Namen wieder als String zusammen.
        this.name = components.join(this.delimiter);
    }



    public append(c: string): void {
        // Wenn der Name leer ist, wird die neue Komponente der ganze Name.
        if (this.isEmpty()) {
            this.name = c;
            return;
        };

        // Ansonsten Anhängen der Komponente (durch den Delimiter getrennt).
        this.name = this.name + this.delimiter + c;
    }



    public remove(n: number): void {
        if (this.isEmpty()) {
            return;
        }

        const components = this.name.split(this.delimiter);

        // Entfernt die Komponente an Index n.
        components.splice(n, 1);

        // Baut den aktualisierten Namen wieder zusammen.
        this.name = components.join(this.delimiter);
    }



    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}