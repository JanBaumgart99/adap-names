import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];
    protected singleCharacterCheck(d: string): void {
        if (d.length !== 1) {
            throw new Error("The Delimiter must be exactly one character");
        }
    }


    constructor(source: string[], delimiter?: string) {
        // Falls ein Delimiter übergeben wird, wird er darauf geprüft dass er genau ein einzelnes Zeichen ist.
        if (delimiter !== undefined) {
            this.singleCharacterCheck(delimiter);
            this.delimiter = delimiter;
        }

        // Kopieren des Array, sodass wir eine 'Defensive Copy' haben, damit wir nicht von späteren äußeren Änderungen betroffen sind.
        this.components = source.slice();
    }



    public asString(delimiter: string = this.delimiter): string {
        // Wenn keine Komponenten vorhanden sind, dann soll ein leerer String zurückgegeben werden.
        if (this.components.length === 0) {
            return "";
        }

        // Verbinde alle Komponenten mit dem (Übergebenen oder STandard.) Delimiter.
        return this.components.join(delimiter);
    }


    public asDataString(): string {
        // Wenn keine Komponenten vorhanden sind, dann soll ein leerer String zurückgegeben werden.
        if (this.components.length === 0) {
            return "";
        }

        // Verbinden aller Komponenten mit dem Standard Delimiter
        return this.components.join(DEFAULT_DELIMITER);
    }


    public getDelimiterCharacter(): string {
        // Zurückgeben der aktuellen gesetzten Delimiter
        return this.delimiter;
    }


    public isEmpty(): boolean {
        // Boolen Abfrage ob Komponenten enthalten sind
        return this.components.length === 0;
    }


    public getNoComponents(): number {
        // Anzahl der aktuellen Komponenten
        return this.components.length;
    }


    public getComponent(i: number): string {
        // Rückgabe der Komponente an dem gefragten Index
        return this.components[i];
    }


    public setComponent(i: number, c: string): void {
        // Ersetzen der Komponente an Index i durch c
        this.components[i] = c;
    }


    public insert(i: number, c: string): void {
        /* Einfügen der neuen Komponente c am Index i 
           und verschieben aller nachfolgenden Komponenten nach rechts */
        this.components.splice(i, 0, c);
    }


    public append(c: string): void {
        // Hinten anhängen der Komponente c an die Komponentenliste
        this.components.push(c);
    }


    public remove(i: number): void {
        // Entfernen der Komponente an Index i
        this.components.splice(i, 1);
    }



    public concat(other: Name): void {
        // Hinzufügen aller Komponenten des anderen Namens an diesen Namen
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}