import { Entity } from "./entity";
import { Chunk } from "./chunk";
import { Vector2, Vector3 } from "@math.gl/core";
import { makeNoise2D } from "fast-simplex-noise";
import { clamp, NoiseType } from "./constants";

export class World {
    entities: Entity[] = [];
    chunks: Chunk[] = [];

    generateChunk(origin: Vector2) {
        const chunk = new Chunk();
        chunk.dimensions.set(20, 20, 20);
        chunk.origin = origin.clone();

        for (let x = 0; x < chunk.dimensions.x; x++) {
            for (let z = 0; z < chunk.dimensions.z; z++) {
                let y = 0;
                switch (chunk.noiseType) {
                    case NoiseType.SIMPLEX:
                        y = makeNoise2D()(x, z);
                }
                y = clamp(y, 0, chunk.dimensions.y);
                chunk.data.push(new Vector3(x, y, z));
            }
        }
        this.chunks.push(chunk);
        return chunk;
    }

    generateWorld() {
        // TODO: chunk loading
        this.generateChunk(new Vector2());
    }
}
