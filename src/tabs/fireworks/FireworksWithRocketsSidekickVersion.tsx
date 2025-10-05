import React, { useRef, useEffect } from 'react';

const FireworksWithRocketsSidekickVersion: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight-80;

        const particles: Particle[] = [];
        const rockets: Rocket[] = [];
        const colors = ['#d74974', '#1bda80', '#466ad0', '#cb29ee', '#d0c556', '#dc672c'];

        class Particle {
            x: number;
            y: number;
            radius: number;
            color: string;
            velocityX: number;
            velocityY: number;
            alpha: number;
            isUpdated: boolean;
            isBaseParticle: boolean

            constructor(x: number, y: number, color: string, velocityX: number, velocityY: number, isBaseParticle: boolean) {
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 2 + 1;
                this.color = color;
                this.velocityX = velocityX;
                this.velocityY = velocityY;
                this.alpha = 1;
                this.isUpdated = false;
                this.isBaseParticle = isBaseParticle;
            }

            draw() {
                context!.save();
                context!.globalAlpha = this.alpha;
                context!.beginPath();
                context!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context!.fillStyle = this.color;
                context!.fill();
                context!.restore();
            }

            update() {
                let subtractor = 0.02;
                if (!this.isBaseParticle && this.isUpdated) {
                    subtractor = 0.01;
                    this.x += this.velocityX / 10;
                    this.y += this.velocityY / 10;
                } else {
                    this.x += this.velocityX;
                    this.y += this.velocityY;
                }
                this.alpha -= subtractor;
                if (!this.isBaseParticle && !this.isUpdated && this.alpha <= 0.2) {
                    this.isUpdated = true;
                    this.alpha = 1;
                }
            }
        }

        class Rocket {
            x: number;
            y: number;
            velocityY: number;
            velocityX: number;
            accelerationX: number; // horizontal acceleration
            exploded: boolean;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.velocityY = Math.random() * -6 - 10;
                this.velocityX = Math.random() * 2 - 1; // initial horizontal velocity (-1 to 1)
                this.accelerationX = (Math.random() * 0.04) - 0.02; // small horizontal acceleration (-0.02 to 0.02)
                this.exploded = false;
            }

            draw() { // draw rocket as small line
                context!.save();
                context!.strokeStyle = '#000000';
                context!.lineWidth = 3;
                context!.beginPath();
                context!.moveTo(this.x, this.y);

                // Calculate a small line segment in the opposite direction of velocity
                const lineLength = 13;
                const angle = Math.atan2(this.velocityY, this.velocityX);

                // Draw the line segment pointing opposite to velocity (like a rocket trail)
                context!.lineTo(
                    this.x - lineLength * Math.cos(angle),
                    this.y - lineLength * Math.sin(angle)
                );

                context!.stroke();
                context!.restore();
            }

            update() {
                if (!this.exploded) {
                    this.velocityX += this.accelerationX; // apply horizontal acceleration
                    this.x += this.velocityX; // update horizontal position

                    this.y += this.velocityY;
                    this.velocityY += 0.1; // gravity

                    // Explode at peak
                    if (this.velocityY >= 0) {
                        this.explode();
                    }
                }
            }

            explode() {
                this.exploded = true;
                const numParticles = 250;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const explosionCenterX = this.x;
                const explosionCenterY = this.y;
                const circleRadius = 1; // radius of initial circle
                const isBaseParticle = Math.random() >= 0.5;

                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const px = explosionCenterX + Math.cos(angle) * circleRadius;
                    const py = explosionCenterY + Math.sin(angle) * circleRadius;
                    const speed = Math.random() * 2 + 2;
                    const velocityX = Math.cos(angle) * speed;
                    const velocityY = Math.sin(angle) * speed;
                    particles.push(new Particle(px, py, color, velocityX, velocityY, isBaseParticle));
                }
            }
        }

        const addRocket = () => {
            const x = Math.random() * canvas.width/8 + canvas.width*0.42;
            // const x = canvas.width / 2; // all rockets start from the middle bottom
            const y = canvas.height * 1.3;
            rockets.push(new Rocket(x, y));
        };

        let animationFrameId: number;
        // let launchIntervalId: number;

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Rockets
            for (let i = rockets.length - 1; i >= 0; i--) {
                const rocket = rockets[i];
                if (rocket.exploded) {
                    rockets.splice(i, 1);
                } else {
                    rocket.draw();
                    rocket.update();
                }
            }

            // Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                if (particle.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    particle.draw();
                    particle.update();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Launch rockets at random intervals
        let launchIntervalId = setInterval(addRocket, 300);

        animate();

        // Cleanup on unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(launchIntervalId);
            rockets.length = 0;
            particles.length = 0;
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block', position: 'fixed', bottom: 0, left: 0, zIndex: 9999 }} />;
};

export default FireworksWithRocketsSidekickVersion;