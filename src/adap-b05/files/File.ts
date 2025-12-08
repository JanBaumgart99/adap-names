import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
}

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(
            this.state === FileState.CLOSED,
            "File is already open or deleted"
        );
        this.state = FileState.OPEN;
    }

    public close(): void {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "File is not open"
        );
        this.state = FileState.CLOSED;
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "File must be open to read"
        );
        IllegalArgumentException.assert(noBytes >= 0, "invalid byte length");

        const result = new Int8Array(noBytes);

        for (let i = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                if (ex instanceof MethodFailedException) {
                    // ignore single-byte failures
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0;
    }
}
