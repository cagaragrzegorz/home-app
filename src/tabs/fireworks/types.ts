export interface Particle {
    id: number; // Unique ID
    type: 'rocket' | 'spark';
    x: number;
    y: number;
    vx: number; // Velocity X
    vy: number; // Velocity Y
    targetY?: number; // For rockets: height to explode at
    color: string; // e.g., 'hsl(120, 100%, 50%)'
    opacity: number;
    gravity: number;
    resistance: number; // Air resistance factor
    shrinkRate: number; // How fast sparks shrink (optional)
    size: number;
}