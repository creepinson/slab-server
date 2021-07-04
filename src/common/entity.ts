import { Transform } from "./transform";

export class Entity {
    constructor(
        public readonly id: string,
        public readonly transform: Transform
    ) {}
}
