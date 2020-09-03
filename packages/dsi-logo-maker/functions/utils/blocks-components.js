import React, { useState, useEffect, useRef } from "react";
import { getIndexModule } from "../utils/blocks";
const Brick = ({ brick, block, colors }) => {
  const { x, w, char, charX } = brick;
  const { background, blackOrWhite } = colors[brick.color % colors.length];
  const { fontYOffset: charY, rowHeight: h, fontSize } = block;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect fill={background} width={w} height={h} strokeWidth="1" stroke={background}></rect>
      <text
        fill={blackOrWhite}
        fontSize={fontSize}
        fontFamily={`F, Helvetica, Sans-Serif`}
        x={charX}
        y={charY}>
        {char}
      </text>
    </g>
  );
};

const Row = ({ row, block, colors }) => {
  const { rowIndex, bricks } = row;
  return (
    <g transform={`translate(0 ${rowIndex * block.rowHeight})`}>
      {bricks.map((brick, i) => (
        <Brick key={i} brick={brick} block={block} colors={colors}></Brick>
      ))}
    </g>
  );
};

export const Block = ({ position, block, colors }) => {
  const { x, y } = position;
  const { rows } = block;
  return (
    <g transform={`translate(${x} ${y})`}>
      {rows.map(row => (
        <Row key={row.rowIndex} row={row} block={block} colors={colors}></Row>
      ))}
    </g>
  );
};

export const Unit = ({ blocks, blockIndex, animation, runtime, position, colors }) => {
  const [index, setIndex] = useState(blockIndex);
  const progress = useRef(animation.progress);
  useEffect(() => {
    const { stepRate } = animation;
    let runtimeProgress = Math.floor(runtime * stepRate);
    if (runtimeProgress > progress.current) {
      progress.current = runtimeProgress;
      setIndex(index => getIndexModule(index + 1, blocks.length));
    }
  }, [runtime]);

  const block = blocks[index];

  return <Block position={position} block={block} colors={colors} />;
};
