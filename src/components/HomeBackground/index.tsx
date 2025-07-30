"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

type BackgroundAnimationProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

function StarField() {
    return (
        <Sparkles
            count={800}
            scale={[100, 100, 100]}
            size={10}
            speed={0.2}
            color={"#7dd3fc"}
        />
    );
}

function ScrollAwareCamera({ scrollOffset }: { scrollOffset: number }) {
    const { camera } = useThree();

    useFrame(() => {
        camera.position.y = scrollOffset * -50;
        camera.position.z = 15 + scrollOffset * 10;
        camera.lookAt(0, scrollOffset * -25, 0);
    });

    return null;
}

function FlowingStreams({ scrollOffset }: { scrollOffset: number }) {
    const groupRef = useRef<THREE.Group>(null);

    const streams = useMemo(() => {
        const streamData = [];
        const numStreams = 15;

        for (let i = 0; i < numStreams; i++) {
            const angle = (i / numStreams) * Math.PI * 2;
            const radius = 8 + Math.sin(i * 0.7) * 3;
            const height = 25 + Math.cos(i * 0.5) * 5;

            const points = [];
            const segments = 1000;

            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const spiralAngle = angle + t * Math.PI * 4;
                const spiralRadius = radius * (1 - t * 0.3) *
                    (0.5 + Math.sin(t * Math.PI * 6) * 0.2);
                const y = (t - 0.5) * height + Math.sin(t * Math.PI * 8) * 2;

                points.push(
                    new THREE.Vector3(
                        Math.cos(spiralAngle) * spiralRadius,
                        y,
                        Math.sin(spiralAngle) * spiralRadius +
                            Math.sin(t * Math.PI * 10) * 1,
                    ),
                );
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(
                curve,
                segments,
                0.02 + i * 0.005,
                12,
                false,
            );

            const material = new THREE.ShaderMaterial({
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTime: { value: 0 },
                    uOpacity: { value: 1 },
                    uSpeed: { value: 0.5 + i * 0.1 },
                    uColor1: { value: new THREE.Color("#00d4ff") },
                    uColor2: { value: new THREE.Color("#0066cc") },
                    uColor3: { value: new THREE.Color("#003366") },
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying float vProgress;
                    void main() {
                        vUv = uv;
                        vProgress = position.y / 25.0 + 0.5;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    varying float vProgress;
                    uniform float uTime;
                    uniform float uOpacity;
                    uniform float uSpeed;
                    uniform vec3 uColor1;
                    uniform vec3 uColor2;
                    uniform vec3 uColor3;
                    
                    void main() {
                        float flow = sin((vProgress * 20.0) - (uTime * uSpeed * 5.0));
                        float intensity = smoothstep(-0.5, 0.5, flow);
                        
                        vec3 color1 = mix(uColor3, uColor2, vProgress);
                        vec3 color2 = mix(color1, uColor1, intensity);
                        
                        float alpha = intensity * uOpacity * (1.0 - abs(vUv.x - 0.5) * 2.0);
                        alpha *= smoothstep(0.0, 0.1, vProgress) * smoothstep(1.0, 0.9, vProgress);
                        
                        gl_FragColor = vec4(color2, alpha);
                    }
                `,
            });

            streamData.push({ geometry, material, rotation: angle, offset: i });
        }

        return streamData;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;

            streams.forEach((stream, _index) => {
                if (
                    stream.material.uniforms &&
                    stream.material.uniforms.uTime &&
                    stream.material.uniforms.uOpacity
                ) {
                    stream.material.uniforms.uTime.value += delta;
                    stream.material.uniforms.uOpacity.value = THREE.MathUtils
                        .clamp(
                            1 - scrollOffset * 0.7,
                            0.2,
                            1,
                        );
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {streams.map((stream, _index) => (
                <mesh
                    key={_index}
                    geometry={stream.geometry}
                    material={stream.material}
                    rotation={[0, stream.rotation, 0]}
                />
            ))}
        </group>
    );
}

function AdditionalFlowLines({ scrollOffset }: { scrollOffset: number }) {
    const groupRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        const lineData = [];
        const numLines = 25;

        for (let i = 0; i < numLines; i++) {
            const points = [];
            const segments = 400;
            const radiusStart = 12 + i * 0.3;
            const radiusEnd = 2 + i * 0.1;

            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const angle = i * 0.4 + t * Math.PI * 3;
                const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
                const y = (t - 0.5) * 30;

                points.push(
                    new THREE.Vector3(
                        Math.cos(angle) * radius,
                        y + Math.sin(t * Math.PI * 4) * 1.5,
                        Math.sin(angle) * radius,
                    ),
                );
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(
                curve,
                segments,
                0.01,
                8,
                false,
            );

            const material = new THREE.ShaderMaterial({
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uTime: { value: 0 },
                    uOpacity: { value: 0.6 },
                    uSpeed: { value: 1 + i * 0.05 },
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform float uTime;
                    uniform float uOpacity;
                    uniform float uSpeed;
                    
                    void main() {
                        float flow = sin(vUv.y * 30.0 - uTime * uSpeed * 3.0);
                        float alpha = smoothstep(-0.3, 0.3, flow) * uOpacity;
                        alpha *= (1.0 - abs(vUv.x - 0.5) * 2.0);
                        
                        vec3 color = vec3(0.2, 0.6, 1.0);
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
            });

            lineData.push({ geometry, material });
        }

        return lineData;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.05;

            lines.forEach((line) => {
                if (
                    line.material.uniforms && line.material.uniforms.uTime &&
                    line.material.uniforms.uOpacity
                ) {
                    line.material.uniforms.uTime.value += delta;
                    line.material.uniforms.uOpacity.value = THREE.MathUtils
                        .clamp(
                            0.6 - scrollOffset * 0.4,
                            0.1,
                            0.6,
                        );
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {lines.map((line, index) => (
                <mesh
                    key={index}
                    geometry={line.geometry}
                    material={line.material}
                />
            ))}
        </group>
    );
}

function ThreeScene({ scrollOffset }: { scrollOffset: number }) {
    return (
        <>
            <StarField />
            <ScrollAwareCamera scrollOffset={scrollOffset} />
            <FlowingStreams scrollOffset={scrollOffset} />
            <AdditionalFlowLines scrollOffset={scrollOffset} />
        </>
    );
}

export default function HomeBackground(
    { children, className, style }: BackgroundAnimationProps,
) {
    const [isMounted, setIsMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setIsMounted(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            setIsMounted(false);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (!isMounted) {
        return (
            <div
                className={className}
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "#0a0f1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(255,255,255,0.3)",
                        borderTop: "3px solid #ffffff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style jsx>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
                </style>
            </div>
        );
    }

    const scrollOffset = Math.min(scrollY / (window.innerHeight * 2), 1);

    return (
        <div
            className={className}
            style={{
                position: "fixed",
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                ...style,
            }}
        >
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                }}
                camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 200 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor("#0a0f1c", 1);
                    gl.setSize(window.innerWidth, window.innerHeight);
                }}
            >
                <color attach="background" args={["#0a0f1c"]} />
                <ambientLight intensity={0.3} />
                <Suspense fallback={null}>
                    <ThreeScene scrollOffset={scrollOffset} />
                </Suspense>
            </Canvas>
            {children}
        </div>
    );
}
