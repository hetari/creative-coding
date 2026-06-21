// Input attribute representing the vertex position provided by Pixi.js.
// It is normalized in the range [0.0, 1.0] across the rendering boundary.
in vec2 aPosition;

// Output variable (varying) that will be interpolated and sent to the fragment
// shader. It tells the fragment shader which pixel of the texture corresponds
// to the current fragment.
out vec2 vTextureCoord;

void main(void) {
  /*
    1. Map the Normalized Input Coordinates to GPU Clip Space
    --------------------------------------------------------
    - `aPosition` is in range [0.0, 1.0].
    - WebGL Clip Space coordinates must be in the range [-1.0, 1.0].
    - Formula: position * 2.0 - 1.0
      * When aPosition = 0.0 -> 0.0 * 2.0 - 1.0 = -1.0 (Left/Bottom)
      * When aPosition = 1.0 -> 1.0 * 2.0 - 1.0 =  1.0 (Right/Top)
    - We set z = 0.0 (2D plane) and w = 1.0 (homogeneous coordinate for
    transformations).
  */
  gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);

  /*
    2. Y-Axis Flipping
    ------------------
    - In WebGL clip space, Y points upwards (bottom is -1.0, top is 1.0).
    - In standard 2D screenspace (and Pixi.js), Y points downwards.
    - Flipping gl_Position.y ensures the filter's output coordinate system
      aligns perfectly with Pixi's canvas coordinate space.
  */
  gl_Position.y = -gl_Position.y;

  /*
    3. Pass Texture Coordinates to the Fragment Shader
    --------------------------------------------------
    - We directly assign the vertex position `aPosition` [0, 1] to
    `vTextureCoord`.
    - The GPU interpolates this value across all pixels (fragments) between the
    vertices.
  */
  vTextureCoord = aPosition;
}
