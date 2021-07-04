import { NoiseType } from "./constants";
import { Vector3, Vector2 } from "@math.gl/core";

export class Chunk {
    noiseType: NoiseType = NoiseType.SIMPLEX;
    readonly dimensions: Vector3 = new Vector3(20, 256, 20);
    frequency: number = 0.2;
    origin: Vector2 = new Vector2();

    data: Vector3[] = [];
}
