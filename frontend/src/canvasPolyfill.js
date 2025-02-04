// src/canvasPolyfill.js
HTMLCanvasElement.prototype.getContext = function (contextType, options) {
  if (contextType === '2d') {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4).fill(0) }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      fillText: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
      strokeText: () => {},
      textAlign: "",
      textBaseline: "",
      quadraticCurveTo: () => {},
      // createRadialGradient stub:
      createRadialGradient: () => ({
        addColorStop: () => {}
      }),
      // Add createLinearGradient stub:
      createLinearGradient: () => ({
        addColorStop: () => {}
      })
    };
  }
  return null;
};
