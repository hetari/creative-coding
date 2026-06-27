#version 300 es

precision mediump float;

out vec4 fragColor;
uniform float uTime;
uniform vec2 uResolution;
uniform float PI;

float heart(vec2 p) {
  p.y -= 0.25;
  float a = atan(p.x, p.y) / 3.14159;
  float r = length(p);
  float h = abs(a);
  float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
  return r - d * 0.5;
}

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.2, 0.2);
  vec3 b = vec3(0.5, 0.3, 0.3);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.1, 0.2);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  // (gl_FragCoord.xy * 2.0 - uResolution.xy) this is for normalize coordinates
  // from 0-1 to -1 to 1 / uResolution.y this is for make it square (not
  // stretched) so the all pount here is to get the uv coordinate in the range
  // of -0.5 to 0.5
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;

  for (float i = 0.0; i < 2.0; i++) {

    vec3 color = palette(heart(uv) + uTime);

    uv = fract(uv * 2.0);
    uv -= 0.5;

    float d = heart(uv);
    d = sin(d * PI * 2.0);
    d = abs(d);
    d = 0.25 / d;

    fragColor = vec4(color * d, 1.0);
  }
}