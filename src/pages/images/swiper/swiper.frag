// Set float precision to high. This is necessary for texture coordinate
// calculations to avoid pixelation or interpolation artifacts.
precision highp float;

// Incoming texture coordinates interpolated from the vertex shader
in vec2 vTextureCoord;

// Uniforms are global variables passed from the CPU (JavaScript/Vue) to the
// GPU. They remain constant across all fragments during a single draw call.
// Pixi.js filter texture matrix (maps screenspace to local coordinate space)
uniform mat3 mappedMatrix;

// The first/primary source texture to transition from
uniform sampler2D uTextureOne;
// The second/target source texture to transition to (spelled Tow to match JS)
uniform sampler2D uTextureTow;

// Aspect ratio vector (calculated in Vue based on canvas & image aspect)
uniform vec2 uvAspect;
uniform float uProgress;

// Dynamically calculated number of vertical divisions based on window width
uniform float uGridDivs;

// Dynamically calculated rotation angle based on window width
uniform float uAngle;

mat2 rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  // 1. Establish homogeneous coordinates for mapping
  vec3 map = vec3(vTextureCoord.xy, 1.0);

  // 2. Aspect Ratio Correction (centered cover crop mapping)
  vec2 uv = (map.xy - 0.5) * uvAspect + 0.5;

  /*
    3. UV Division / Striping (Slicing the image)
    ---------------------------------------------
    - `uv * vec2(uGridDivs, 1.0)` scales the X coordinate by uGridDivs and
    keeps Y at 1.0. This means as X goes from 0.0 to 1.0, the scaled X goes
    from 0.0 to uGridDivs.
    - `fract()` keeps only the fractional part (e.g., fract(12.34) = 0.34).
    - This creates uGridDivs repeating gradients of [0.0, 1.0] horizontally
    across the screen (dynamically sized based on device size, e.g., 50.0 for
    desktop and 10.0 for mobile).
    - These repeating coordinate values will be used to displace the original
      UVs.
  */
  vec2 uvDivided = fract(uv * vec2(uGridDivs, 1.0));

  // 4. Progress Clamp
  float progress = clamp(uProgress, 0.0, 1.0);

  /*
    5. Coordinate Displacement & Rotation
    -------------------------------------
    - We want to offset the sampling coordinate (`uv`) of the texture.
    - We take our striped grid `uvDivided`.
    - We rotate these offset vectors by uAngle (e.g. 45 degrees / PI / 4.0 on
    desktop, 18 degrees / PI / 10.0 on mobile). This rotates the displacement
    direction so it shifts diagonally rather than strictly horizontally.
    - We scale the offset of the first image by `progress` (displacement
    increases as we transition away) and scale the second image's offset by
    `(1.0 - progress)` (displacement decreases as it resolves).
    - We add these offsets back to the clean `uv`, scaled by 0.1 to control
    displacement intensity.
  */
  vec2 uvDisplaced1 = uv + rotate(uAngle) * uvDivided * progress * 0.1;
  vec2 uvDisplaced2 = uv + rotate(uAngle) * uvDivided * (1.0 - progress) * 0.1;

  /*
    6. Final Sample
    ---------------
    - We sample the texture `uTextureOne` and `uTextureTow` using our displaced
    UV coordinates.
    - If we want to see the raw grid division instead of the image
    displacement, we could output `gl_FragColor = vec4(uvDivided, 0., 1.);`
  */
  vec4 img1 = texture2D(uTextureOne, uvDisplaced1);
  vec4 img2 = texture2D(uTextureTow, uvDisplaced2);
  gl_FragColor = mix(img1, img2, progress);
}
