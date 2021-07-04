import { Vector3 } from "@math.gl/core";

export class Transform {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;

    constructor(pos?: Vector3, rot?: Vector3, scale?: Vector3) {
        this.position = pos || Vector3.ZERO;
        this.rotation = rot || Vector3.ZERO;
        this.scale = scale || new Vector3(1, 1, 1);
    }

    clone(): Transform {
        return new Transform(
            this.position.clone(),
            this.rotation.clone(),
            this.scale.clone()
        );
    }
}
