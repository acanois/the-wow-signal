import {
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
} from '@babylonjs/core'

import { MovingBody } from './movingBody'

export class Attractor {
  position: Vector3
  velocity: Vector3
  acceleration: Vector3
  mass: number
  radius: number
  mesh: Mesh
  scene: Scene

  constructor(
    position: Vector3,
    velocity: Vector3,
    acceleration: Vector3,
    mass: number,
    radius: number,
    scene: Scene
  ) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
    this.mass = mass
    this.radius = radius
    this.scene = scene
    this.mesh = this.createMesh()
  }

  setMag(inputVector: Vector3, targetMag: number) {
    const currentMag = inputVector.length()
    const x = inputVector.x * (targetMag / currentMag)
    const y = inputVector.y * (targetMag / currentMag)
    const z = inputVector.z * (targetMag / currentMag)

    return new Vector3(x, y, z)
  }

  attract(body: Attractor): Vector3 {
    const G = 0.001
    const force = this.position.subtract(body.position)
    const gravity = (G * this.mass * body.mass) / force.lengthSquared()

    return this.setMag(force, gravity)
  }

  update() {
    this.velocity.addInPlace(this.acceleration)
    this.position.addInPlace(this.velocity)
    this.acceleration.multiplyInPlace(Vector3.Zero())
  }

  applyForce(force: Vector3) {
    const f = force.scale(1 / this.mass)
    this.acceleration = this.acceleration.add(f)
  }

  createMesh(): Mesh {
    const sphere = MeshBuilder.CreateSphere(
      'mover',
      {
        diameter: this.mass,
      },
      this.scene
    )
    sphere.position = this.position
    const sphereMaterial: StandardMaterial = new StandardMaterial(
      'moverMaterial',
      this.scene
    )
    sphereMaterial.diffuseColor = new Color3(0.3, 0.8, 0.3)
    sphere.material = sphereMaterial

    return sphere
  }
}
