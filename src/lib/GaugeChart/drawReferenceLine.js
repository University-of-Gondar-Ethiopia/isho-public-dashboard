import { easeElastic, interpolateNumber } from "d3";
import {
  calculateRotation,
  calculateRotationBaseline,
  addText,
  addLabelText,
} from "./utils";

//If 'resize' is true then the animation does not play
export const drawReferenceLines = (
  resize,
  prevProps,
  props,
  width,
  baselineNeedle,
  container,
  outerRadius,
  g
) => {
  const {
    baseline,
    needleColor,
    needleBaseColor,
    hideText,
    animate,
    needleScale,
    textComponent,
  } = props;

  let needleRadius = 15 * (width.current / 1500), // Make the needle radius responsive
    centerPoint = [0, -needleRadius / 2];

  //Remove the old stuff
  baselineNeedle.current.selectAll("*").remove();

  //Translate the needle starting point to the middle of the arc
  baselineNeedle.current.attr(
    "transform",
    "translate(" + outerRadius.current + ", " + outerRadius.current + ")"
  );

  //Draw the triangle
  //let pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  const prevPercent = prevProps ? prevProps.baseline : 0;
  let pathStr = calculateRotationBaseline(
    prevPercent || baseline,
    outerRadius,
    width,
    needleScale,
    needleRadius
  );
  baselineNeedle.current
    .append("path")
    .attr("d", pathStr)
    .attr("fill", "#000")
    .style("opacity", ".6");
  //Add a circle at the bottom of needle
  baselineNeedle.current
    .append("circle")
    .attr("cx", centerPoint[0])
    .attr("cy", centerPoint[1])
    .attr("r", needleRadius)
    .attr("fill", "#000");
  if (!hideText && !textComponent) {
    addLabelText(baseline, props, outerRadius, width, g, "baseline");
  }
  //Rotate the needle
  if (!resize && animate) {
    baselineNeedle.current
      .transition()
      .delay(props.animDelay)
      .ease(easeElastic)
      .duration(props.animateDuration)
      .tween("progress", function () {
        const currentPercent = interpolateNumber(prevPercent, baseline);
        return function (percentOfPercent) {
          const progress = currentPercent(percentOfPercent);
          return container.current
            .select(`.needle path`)
            .attr(
              "d",
              calculateRotation(progress, outerRadius, width, needleScale)
            );
        };
      });
  } else {
    container.current
      .select(`.needle path`)
      .attr("d", calculateRotation(baseline, outerRadius, width, needleScale));
  }
};

export const drawTargetLine = (
  resize,
  prevProps,
  props,
  width,
  targetLineNeedle,
  container,
  outerRadius,
  g
) => {
  const {
    target,
    needleColor,
    needleBaseColor,
    hideText,
    animate,
    needleScale,
    textComponent,
  } = props;

  let needleRadius = 15 * (width.current / 1500), // Make the needle radius responsive
    centerPoint = [0, -needleRadius / 2];

  //Remove the old stuff
  targetLineNeedle.current.selectAll("*").remove();

  //Translate the needle starting point to the middle of the arc
  targetLineNeedle.current.attr(
    "transform",
    "translate(" + outerRadius.current + ", " + outerRadius.current + ")"
  );

  //Draw the triangle
  //let pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  const prevPercent = prevProps ? prevProps.target : 0;
  let pathStr = calculateRotationBaseline(
    prevPercent || target,
    outerRadius,
    width,
    needleScale,
    needleRadius
  );
  targetLineNeedle.current
    .append("path")
    .attr("d", pathStr)
    .attr("fill", "#00897B")
    .style("transform", "scale(1)")
    .style("opacity", ".6");
  //Add a circle at the bottom of needle
  targetLineNeedle.current
    .append("circle")
    .attr("cx", centerPoint[0])
    .attr("cy", centerPoint[1])
    .attr("r", needleRadius)
    .attr("fill", "#00897B");
  if (!hideText && !textComponent) {
    addLabelText(target, props, outerRadius, width, g, "target");
  }
  //Rotate the needle
  if (!resize && animate) {
    targetLineNeedle.current
      .transition()
      .delay(props.animDelay)
      .ease(easeElastic)
      .duration(props.animateDuration)
      .tween("progress", function () {
        const currentPercent = interpolateNumber(prevPercent, target);
        return function (percentOfPercent) {
          const progress = currentPercent(percentOfPercent);
          return container.current
            .select(`.needle path`)
            .attr(
              "d",
              calculateRotation(progress, outerRadius, width, needleScale)
            );
        };
      });
  } else {
    container.current
      .select(`.needle path`)
      .attr("d", calculateRotation(target, outerRadius, width, needleScale));
  }
};
