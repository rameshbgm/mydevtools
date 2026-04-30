"use client";

import React, { useEffect, useRef } from "react";

interface WebGLHeroTitleProps {
    text: string;
    darkMode: boolean;
}

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform float u_time;
uniform sampler2D u_text;
varying vec2 v_uv;

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  float alpha = texture2D(u_text, uv).a;
  float glowNear = texture2D(u_text, uv + vec2(0.003, 0.0)).a;
  float glowFar = texture2D(u_text, uv + vec2(0.008, 0.0)).a;
  float glow = (glowNear * 0.45) + (glowFar * 0.35);

  vec3 c1 = vec3(0.0, 0.95, 1.0);
  vec3 c2 = vec3(0.5, 0.3, 1.0);
  vec3 c3 = vec3(1.0, 0.25, 0.8);
  vec3 c4 = vec3(0.2, 1.0, 0.7);

  float t = 0.5 + 0.5 * sin(u_time * 0.9);
  vec3 gradA = mix(c1, c2, smoothstep(0.0, 1.0, uv.x + t * 0.2));
  vec3 gradB = mix(c3, c4, smoothstep(0.0, 1.0, uv.x - t * 0.2));
  vec3 neonColor = mix(gradA, gradB, 0.45 + 0.35 * sin(u_time * 0.7 + uv.y * 5.0));

  float pulse = 0.82 + 0.18 * sin(u_time * 2.2);
  vec3 finalColor = neonColor * pulse;
  float finalAlpha = min(alpha + glow, 1.0);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const createProgram = (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
    }

    return program;
};

export default function WebGLHeroTitle({ text, darkMode }: Readonly<WebGLHeroTitleProps>) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
        if (!gl) return;

        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const textLocation = gl.getUniformLocation(program, "u_text");

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        const textCanvas = document.createElement("canvas");
        const textCtx = textCanvas.getContext("2d");
        if (!textCtx) return;

        const texture = gl.createTexture();
        if (!texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const drawTextTexture = () => {
            const width = Math.max(900, Math.floor(window.innerWidth * 1.2));
            const height = 260;
            textCanvas.width = width;
            textCanvas.height = height;

            textCtx.clearRect(0, 0, width, height);
            textCtx.fillStyle = "rgba(0, 0, 0, 0)";
            textCtx.fillRect(0, 0, width, height);
            textCtx.textAlign = "center";
            textCtx.textBaseline = "middle";
            textCtx.font = `800 ${Math.max(54, Math.floor(width * 0.074))}px "Segoe UI", "Arial Black", sans-serif`;
            textCtx.fillStyle = darkMode ? "rgba(245,248,255,1)" : "rgba(12,18,28,1)";
            textCtx.fillText(text, width / 2, height / 2);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
        };

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const cssWidth = canvas.clientWidth;
            const cssHeight = canvas.clientHeight;
            const displayWidth = Math.floor(cssWidth * dpr);
            const displayHeight = Math.floor(cssHeight * dpr);

            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
            }
            gl.viewport(0, 0, canvas.width, canvas.height);
            drawTextTexture();
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1i(textLocation, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const start = performance.now();
        let frameId = 0;
        const animate = (now: number) => {
            const time = (now - start) / 1000;
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(timeLocation, time);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resizeCanvas);
            gl.deleteTexture(texture);
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
        };
    }, [text, darkMode]);

    return (
        <div className="webgl-title-wrap" aria-label={text}>
            <canvas ref={canvasRef} className="webgl-title-canvas" />
        </div>
    );
}
