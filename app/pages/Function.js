import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import Checkbox from "../components/input/Checkbox";
import { Mechanic } from "../utils/mechanic";
import { getTimeStamp } from "../utils";
import css from "./Function.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const [fastPreview, setFastPreview] = useState(true);
  const canvasParent = useRef();
  const mainRef = useRef();
  const randomSeed = useRef();

  const { handler, params, settings } = exports;
  const sizes = Object.keys(params.size);

  const handleOnChange = (e, name, value) => {
    setValues(Object.assign({}, values, { [name]: value }));
  };

  const handlePreview = async () => {
    const finalValues = Object.assign({}, values);
    if (fastPreview) {
      const bounds = mainRef.current.getBoundingClientRect();
      finalValues.scaleDownToFit = {
        width: bounds.width - 100,
        height: bounds.height - 100
      };
    }
    const mechanic = new Mechanic(handler, params, settings, finalValues, {
      preview: true
    });
    mechanic.addEventListener("init", (el, payload) => {
      canvasParent.current.innerHTML = "";
      canvasParent.current.appendChild(el);
      randomSeed.current = payload.randomSeed;
    });
    mechanic.addEventListener("frame", el => {
      // Only if the element changed (HACK! React for SVG?)
      if (el !== canvasParent.current.childNodes[0]) {
        canvasParent.current.innerHTML = "";
        canvasParent.current.appendChild(el);
      }
    });
    mechanic.run();
  };

  const handleExport = async () => {
    // Add random seed from last preview
    const vals = Object.assign({}, values);
    if (randomSeed.current) {
      vals.randomSeed = randomSeed.current;
    }

    const mechanic = new Mechanic(handler, params, settings, vals);
    mechanic.addEventListener("init", el => {
      // Show loading animation?
    });
    mechanic.addEventListener("frame", el => {
      // Tick frames in loading animation?
    });
    mechanic.addEventListener("done", el => {
      mechanic.download(`${name}-${getTimeStamp()}`);
    });
    mechanic.run();
  };

  return (
    <div className={css.root}>
      <aside>
        {children}
        <Select onChange={handleOnChange} name="size" value={values.size || "default"}>
          {sizes.map(size => (
            <option key={`size-${size}`} value={size}>
              {size} ({params.size[size].width}x{params.size[size].height})
            </option>
          ))}
        </Select>
        <Checkbox
          label="Fast Preview"
          checked={fastPreview}
          onChange={e => setFastPreview(e.target.checked)}
        />
        <br />
        <Button onClick={handlePreview}>Preview</Button>
        <Button onClick={handleExport}>Export</Button>
      </aside>
      <main ref={mainRef}>
        <div ref={canvasParent}></div>
      </main>
    </div>
  );
};

Function.propTypes = {
  name: PropTypes.string.isRequired,
  exports: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  })
};

export default Function;