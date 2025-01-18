import React, { useEffect, useRef } from 'react';
import { RadialGauge } from 'canvas-gauges';

/**
 * A half-circle gauge (0–100) transitioning 
 * in 10-point steps from red at 0 to green at 100.
 *
 * No barProgress mode, just multiple highlights to avoid black overlay.
 * The result is a bright, stepped gradient without pastels or transparency.
 */
const Gauge = ({ value, label }) => {
  const gaugeRef = useRef(null);

  useEffect(() => {
    const gauge = new RadialGauge({
      renderTo: gaugeRef.current,
      units: label,
      value: value,
      minValue: 0,
      maxValue: 100,
      majorTicks: ['0','20','40','60','80','100'],
      minorTicks: 2,

      // Size and half-circle arc
      width: 200,
      height: 200,
      startAngle: 90,
      ticksAngle: 180,

      // Basic gauge styling
      colorPlate: '#fff',
      colorUnits: '#333',
      colorNumbers: '#333',
      borders: false,

      // Needle styling
      colorNeedle: 'rgba(200, 50, 50, .75)',
      colorNeedleEnd: 'rgba(200, 50, 50, .9)',

      // Animation
      animationDuration: 1500,
      animationRule: 'bounce',

      // Center value box
      valueBox: true,

      /**
       * Ten small highlights from 0→100 in 10-point increments.
       * This creates a stepped rainbow from red to green.
       */
      highlights: [
        { from: 0,   to: 10,  color: '#ff0000' }, // bright red
        { from: 10,  to: 20,  color: '#ff3300' },
        { from: 20,  to: 30,  color: '#ff6600' },
        { from: 30,  to: 40,  color: '#ff9900' },
        { from: 40,  to: 50,  color: '#ffcc00' },
        { from: 50,  to: 60,  color: '#ffff00' }, // yellow
        { from: 60,  to: 70,  color: '#ccff00' },
        { from: 70,  to: 80,  color: '#99ff00' },
        { from: 80,  to: 90,  color: '#66ff00' },
        { from: 90,  to: 100, color: '#00ff00' }, // bright green
      ],
    });

    gauge.draw();

    // Cleanup on unmount
    return () => {
      gauge.destroy();
    };
  }, [value, label]);

  return <canvas ref={gaugeRef} />;
};

export default Gauge;
