import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode!: Directory;


    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "basename must not be null or undefined"
        );
        IllegalArgumentException.assert(
            pn !== null && pn !== undefined,
            "parent directory must not be null or undefined"
        );

        this.doSetBaseName(bn);
        this.initialize(pn);
        this.assertInvariant();
    }



    //  INITIALIZATION & MOVING

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(
            to !== null && to !== undefined,
            "move(): target directory must not be null or undefined"
        );

        const oldParent = this.parentNode;
        oldParent.removeChildNode(this);

        to.addChildNode(this);
        this.parentNode = to;

        this.assertInvariant();
    }



    //  NAME ACCESS

    public getFullName(): Name {
        const fullname: Name = this.parentNode.getFullName();
        fullname.append(this.getBaseName());
        return fullname;
    }

    public getBaseName(): string {
        const bn = this.doGetBaseName();
        InvalidStateException.assert(
            bn !== null && bn !== undefined,
            "invalid state: basename is null or undefined"
        );
        InvalidStateException.assert(
            bn.length > 0 || this.isRootNode(),
            "invalid state: basename must not be empty for non-root nodes"
        );
        return bn;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(
            this.isValidBaseName(bn),
            "rename(): invalid base name"
        );

        this.doSetBaseName(bn);
        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }



    //  RECURSIVE SEARCH

    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            this.isValidBaseName(bn),
            "findNodes(): invalid search basename"
        );

        try {
            const matches = new Set<Node>();
            this.collectNodes(bn, matches);
            return matches;

        } catch (error: any) {
            // Wrap all internal failures as service failures
            throw new ServiceFailureException("findNodes() failed", error);
        }
    }

    protected collectNodes(bn: string, matches: Set<Node>): void {
        if (this.getBaseName() === bn) {
            matches.add(this);
        }

        for (const child of this.getChildNodes()) {
            child.collectNodes(bn, matches);
        }
    }

    protected getChildNodes(): Iterable<Node> {
        return []; // overridden in Directory
    }



    //  VALIDATION & INVARIANT

    protected isValidBaseName(bn: string): boolean {
        return (
            bn !== null &&
            bn !== undefined &&
            typeof bn === "string" &&
            bn.trim().length > 0
        );
    }

    protected isRootNode(): boolean {
        return this.parentNode === (this as unknown as Directory);
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(
            this.baseName !== null && this.baseName !== undefined,
            "Node invariant: basename must not be null/undefined"
        );

        InvalidStateException.assert(
            this.isRootNode() || this.baseName.length > 0,
            "Node invariant: non-root basename must not be empty"
        );

        InvalidStateException.assert(
            this.parentNode !== null && this.parentNode !== undefined,
            "Node invariant: parentNode must not be null/undefined"
        );
    }
}
