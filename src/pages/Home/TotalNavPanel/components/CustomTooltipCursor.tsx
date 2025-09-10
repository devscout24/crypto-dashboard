/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltipCursor = (props: any) => {
  const { points, height, payload, minValue, maxValue } = props;

  if (points && points.length > 0) {
    const { x } = points[0];
    const value = payload[0]?.value;

    if (value === undefined || maxValue === minValue) return null;

    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const yPosition = height - normalizedValue * height;

    return (
      <g>
        <line
          x1={x}
          y1={yPosition}
          x2={x}
          y2={height}
          stroke="var(--color-chart-1)"
          strokeWidth={3}
          strokeDasharray="5 3"
          opacity={0.7}
        />
        <circle
          cx={x}
          cy={yPosition + 8}
          r={8}
          fill="var(--color-chart-1)"
          stroke="var(--color-chart-1)"
          strokeWidth={3}
          opacity={1}
          filter="drop-shadow(0 0 6px var(--color-chart-1))"
        />
        {/* <circle cx={x} cy={yPosition + 8} r={4} fill="white" opacity={1} /> */}
      </g>
    );
  }
  return null;
};

export default CustomTooltipCursor;
