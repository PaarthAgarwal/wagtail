/**
 * Generate a CSS calc() expression as either an addition or subtraction
 * of the difference between two values, depending on which is greatest.
 */
const calcVarOperation = (variable, reference, value, unit = '') => {
  const ref = Number(reference);
  const val = Number(value);
  if (ref > val) {
    return `calc(var(${variable}) - ${ref - val}${unit})`;
  }
  if (ref < val) {
    return `calc(var(${variable}) + ${val - ref}${unit})`;
  }
  // For equal values, reference the variable directly.
  return `var(${variable})`;
};

const generateColorVariables = (colors) => {
  /* eslint-disable no-param-reassign, id-length */
  const colorVariables = Object.values(colors).reduce((vars, hues) => {
    // Use the DEFAULT hue as a reference to derive others from, or the darkest.
    const darkestHue = Object.keys(hues).sort((a, b) => b - a)[0];
    const reference = hues.DEFAULT || hues[darkestHue];
    const [refH, refS, refL] = reference.hsl.match(/\d+/g);
    const refVar = reference.cssVariable;

    Object.values(hues).forEach((shade) => {
      const cssVar = shade.cssVariable;
      let [h, s, l] = shade.hsl.match(/\d+/g);
      const isReferenceShade = reference.hex === shade.hex;
      if (isReferenceShade) {
        s = `${s}%`;
        l = `${l}%`;
      } else {
        h = calcVarOperation(`${refVar}-hue`, refH, h);
        s = calcVarOperation(`${refVar}-saturation`, refS, s, '%');
        l = calcVarOperation(`${refVar}-lightness`, refL, l, '%');
      }
      vars[
        cssVar
      ] = `hsl(var(${cssVar}-hue) var(${cssVar}-saturation) var(${cssVar}-lightness))`;
      vars[`${cssVar}-hue`] = h;
      vars[`${cssVar}-saturation`] = s;
      vars[`${cssVar}-lightness`] = l;
    });

    return vars;
  }, {});
  return colorVariables;
};

module.exports = {
  generateColorVariables,
};
