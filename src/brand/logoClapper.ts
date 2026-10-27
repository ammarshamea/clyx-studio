/**
 * Clapper closing angles derived from logo symbol geometry (userSpaceOnUse).
 * Inner mating edges: arm-top hinge → outer corner, arm-bottom hinge → outer corner.
 */

export const TOP_HINGE = { x: 889.92, y: 748.7 } as const;
export const BOTTOM_HINGE = { x: 889.92, y: 763.27 } as const;

const TOP_MATE = { x: 1788.97, y: 426.61 };
const BOTTOM_MATE = { x: 1788.97, y: 1085.35 };

function restAngle(hinge: { x: number; y: number }, mate: { x: number; y: number }) {
  return (Math.atan2(mate.y - hinge.y, mate.x - hinge.x) * 180) / Math.PI;
}

/** Resting inner-edge incline (degrees) from horizontal. */
export const TOP_REST_ANGLE = restAngle(TOP_HINGE, TOP_MATE);
export const BOTTOM_REST_ANGLE = restAngle(BOTTOM_HINGE, BOTTOM_MATE);

/** Vertical offset between the two hinge tips. */
export const HINGE_SPREAD = BOTTOM_HINGE.y - TOP_HINGE.y;

/**
 * X coordinate (SVG user units) where the inner edges should meet flush.
 * Chosen just right of the static hub wedges (~950–1000 in the artwork).
 */
export const CLAPPER_SEAM_X = 980;

/**
 * Symmetric rotation (degrees, top + / bottom −) so inner edges meet at CLAPPER_SEAM_X.
 * spread + 2·dx·tan(BOTTOM_REST_ANGLE − θ) = 0  →  ~24.3°
 */
export function clapperCloseAngle(seamX = CLAPPER_SEAM_X): number {
  const dx = seamX - TOP_HINGE.x;
  if (dx <= 0) throw new Error("Seam must be to the right of the hinge");
  const tilt = Math.atan(-HINGE_SPREAD / (2 * dx)) * (180 / Math.PI);
  return BOTTOM_REST_ANGLE - tilt;
}

/** Closed pose: top swings down (+), bottom swings up (−). */
export function clapperPose(seamX = CLAPPER_SEAM_X) {
  const close = clapperCloseAngle(seamX);
  return { top: close, bottom: -close };
}
