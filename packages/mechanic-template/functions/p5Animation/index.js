import engine from "mechanic-p5-engine";

export const handler = async (sketch, params, mechanic) => {
  const { width, height, primaryColor, secondaryColor, maxFrames } = params;

  let x = 0;
  let frames = 0;
  sketch.setup = () => {
    sketch.createCanvas(width, height);
  };

  sketch.draw = () => {
    sketch.background(primaryColor);
    sketch.fill(secondaryColor);
    sketch.rect(x, height / 2, width / 3, width / 3);

    x++;

    if (frames < maxFrames && x < width) {
      mechanic.frame();
      frames += 1;
    } else {
      mechanic.done();
    }
  };
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  size: {
    default: {
      width: 400,
      height: 300
    },
    medium: {
      width: 800,
      height: 600
    },
    large: {
      width: 1600,
      height: 1200
    },
    xlarge: {
      width: 3200,
      height: 2400
    }
  },
  primaryColor: {
    type: "string",
    default: "#FF0000"
  },
  secondaryColor: {
    type: "string",
    default: "#00FFFF"
  },
  maxFrames: {
    type: "integer",
    default: 100
  }
};

export const settings = {
  engine,
  animated: true
};
