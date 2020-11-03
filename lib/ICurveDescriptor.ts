export interface ICurveDescriptor {
    name: string,
    width: number,
    radius?: number,
    tangent?: number,
    shape?: number,
    ecc?: number,
    inheritTangent?: boolean
}
