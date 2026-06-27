#version 300 es

precision mediump float;

out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) - 0.5;

  uv.x *= uResolution.x / uResolution.y;

  uv -= 0.5;
  uv = fract(uv * 3.0);
  uv -= 0.5;

  float d = length(uv);

  fragColor = vec4(d, d, d, 1.0);
}