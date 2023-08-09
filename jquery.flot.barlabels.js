/**
* Bar Labels Plugin for flot.
* https://github.com/cleroux/flot.barlabels
*/
(function ($) {

    var positions = {
        middle: 0,
        base: 1,
        end: 2,
        outside: 3
    };

    var options = {
        series: {
            labels: {
                show: true,
                font: "flot-bar-label",
                labelFormatter: function(v) {return v;},
                position: "middle",
                padding: 4,
                angle: 0,
                nudgeOversize: true
            }
        }
    };

    function init(plot, classes) {

        var Canvas = classes.Canvas;
        var barLabels = null;

        plot.hooks.draw.push(function(plot, ctx) {

            var placeholder = plot.getPlaceholder();
			let layer = "flot-bar-labels";
            if (barLabels == null) {
                barLabels = new Canvas(layer, placeholder);
            }
			else {
				// Move the labels layer under the overlay to preserve flot interactivity
				barLabels.removeText(layer);
			}
            
            var labelsEl = barLabels.element;
            var target = $(labelsEl.parentElement).children(".flot-overlay:first");
            $(labelsEl).insertBefore(target);

            var halign = "center";
            var valign = "middle";
            var stacks = {};

            $.each(plot.getData(), function(ii, series) {
                if (!series.bars.show || !series.labels.show) {
                    return;
                }

                for (let i = 0; i < series.data.length; i++) {
                    let text = null;
                    let x = series.datapoints.points[i*series.datapoints.pointsize];
                    let y = series.data[i][1];
                    let b = series.data[i].length > 2 && series.data[i][2] ? series.data[i][2] : 0;
                    let px = null;
                    let py = null;
                    let lf = series.labels.labelFormatter;
                    let width;
                    let pos = positions[series.labels.position];

                    if (plot.getOptions().series.bars.horizontal) {
                        if (series.stack !== undefined) {
                            if (stacks[y] === undefined) {
                                stacks[y] = x;
                            } else {
                                b = stacks[y];
                                stacks[y] += series.data[i][0];
                            }
                        }
                        width = series.xaxis.p2c(x);
                        px = series.xaxis.p2c(x) + plot.getPlotOffset().left;
                        if (series.stack !== undefined && ii > 0) {
                            px = series.xaxis.p2c(stacks[y]) + plot.getPlotOffset().left;
                        }
                        py = series.yaxis.p2c(y) + plot.getPlotOffset().top;
                        let pb = series.xaxis.p2c(b) + plot.getPlotOffset().left;
                        if (series.stack != undefined) {
                            text = lf ? lf(stacks[y] - b, series) : stacks[y] - b;
                        } else {
                            text = lf ? lf(x-b, series) : x-b;
                        }
                        let textInfo = barLabels.getTextInfo(layer, text, series.labels.font, series.labels.angle, width);
                        if (series.labels.nudgeOversize && Math.abs((series.xaxis.p2c(0) - width)) - series.labels.padding < textInfo.width) {
                            pos = positions.outside;
                        }

                        if (pos == positions.outside) {
                            if (x >= 0) {
                                halign = "left";
                                px += series.labels.padding;
                            } else {
                                halign = "right";
                                px -= series.labels.padding;
                            }
                        } else if (pos == positions.end) {
                            if (x >= 0) {
                                halign = "right";
                                px -= series.labels.padding;
                            } else {
                                halign = "left";
                                px += series.labels.padding;
                            }
                        } else if (pos == positions.base) {
                            if (x >= 0) {
                                halign = "left";
                                px = pb + series.labels.padding;
                            } else {
                                halign = "right";
                                px = pb - series.labels.padding;
                            }
                        } else {
                            halign = "center";
                            px = pb + ((px - pb) / 2);
                        }
                    } else {
                        if (series.stack !== undefined) {
                            if (stacks[x] === undefined) {
                                stacks[x] = y;
                            } else {
                                b = stacks[x];
                                stacks[x] += y;
                            }
                        }
                        width = series.xaxis.p2c(series.bars.barWidth);
                        px = series.xaxis.p2c(x) + plot.getPlotOffset().left;
                        py = series.yaxis.p2c(y) + plot.getPlotOffset().top;
                        if (series.stack !== undefined && ii > 0) {
	                        py = series.yaxis.p2c(stacks[x]) + plot.getPlotOffset().top;
                        }
                        let pb = series.yaxis.p2c(b) + plot.getPlotOffset().top;
                        if (series.stack !== undefined) {
                            text = lf ? lf(stacks[x] - b, series) : stacks[x] - b;
                        } else {
                            text = lf ? lf(y - b, series) : y - b;
                        }
                        let textInfo = barLabels.getTextInfo(layer, text, series.labels.font, series.labels.angle, width);
                        if (series.labels.nudgeOversize && Math.abs((series.yaxis.p2c(0) - series.yaxis.p2c(y))) - series.labels.padding < textInfo.height) {
                            pos = positions.outside;
                        }

                        if (pos == positions.outside) {
                            if (y >= 0) {
                                valign = "bottom";
                                py -= series.labels.padding;
                            } else {
                                valign = "top";
                                py += series.labels.padding;
                            }
                        } else if (pos == positions.end) {
                            if (y >= 0) {
                                valign = "top";
                                py += series.labels.padding;
                            } else {
                                valign = "bottom";
                                py -= series.labels.padding;
                            }
                        } else if (pos == positions.base) {
                            if (y >= 0) {
                                valign = "bottom";
                                py = pb - series.labels.padding;
                            } else {
                                valign = "top";
                                py = pb + series.labels.padding;
                            }
                        } else {
                            valign = "middle";
                            py = pb + ((py - pb) / 2);
                        }
                    }

                    barLabels.addText(layer, px, py, text, series.labels.font, series.labels.angle, width, halign, valign);
                }
            });
            barLabels.render();
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "barlabels",
        version: "1.0"
    });
})(jQuery);
