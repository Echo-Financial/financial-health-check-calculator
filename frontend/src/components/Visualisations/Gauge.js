import React, { useEffect, useRef } from 'react';
import { RadialGauge } from 'canvas-gauges';

const Gauge = ({ value, label }) => {
    const gaugeRef = useRef(null);

    useEffect(() => {
        // Initialize the RadialGauge
        const gauge = new RadialGauge({
            renderTo: gaugeRef.current, // Render the gauge to this element
            units: label,
            value: value,
            minValue: 0,
            maxValue: 100,
            majorTicks: ["0", "20", "40", "60", "80", "100"],
            minorTicks: 2,
            width: 200,
            height: 200,
            startAngle: 90,
            ticksAngle: 180,
            colorPlate: "#fff",
            colorUnits: "#333",
            colorNumbers: "#333",
            colorNeedle: "rgba(200, 50, 50, .75)",
            colorNeedleEnd: "rgba(200, 50, 50, .9)",
            animationDuration: 1500,
            animationRule: "bounce",
            valueBox: true,
            borders: false,
        });

        gauge.draw();

        return () => {
            gauge.destroy(); // Cleanup the gauge instance
        };
    }, [value, label]);

    return <canvas ref={gaugeRef}></canvas>; // Render a canvas for the gauge
};

export default Gauge;
