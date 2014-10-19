/**
* Bar Labels Plugin for flot.
* 
*/
(function ($) {

	var options = {
		series: {
			labels: {
				show: true,
				font: "flot-bar-label",
				labelFormatter: function(v) {return v;},
				position: "middle" // base, middle, end, outer-end
			}
		}
	};
	
	function init(plot, classes) {
	
		var Canvas = classes.Canvas;

		plot.hooks.draw.push(function(plot, ctx) {
		
			var barLabels = new Canvas("flot-bar-labels", plot.getPlaceholder());

			// Move the labels layer under the overlay to preserve interactivity
			var labelsEl = barLabels.element;
			var target = $(labelsEl.parentElement).children(".flot-overlay:first");
			$(labelsEl).insertBefore(target);
			
			var angle = 0;
			var halign = "center";
			var valign = "middle";
			var layer = "flot-bar-labels";
			$.each(plot.getData(), function(ii, series) {
				if (!series.labels.show) {
					return;
				}
				// TODO: This for loop should be turned inside out for performance.
				// string comparisons should be brought out of the loop and looping
				// over points should be done inside each block of options.
				for (var i = 0; i < series.data.length; ++i) {
					var text = null;
					var x = series.data[i][0];
					var y = series.data[i][1];
					var b = series.data[i].length > 2 ? series.data[i][2] : 0;
					var px = null;
					var py = null;
					var lf = series.labels.labelFormatter;
					
					if (plot.getOptions().bars.horizontal) {
						px = series.xaxis.p2c(x) + plot.getPlotOffset().left;
						py = series.yaxis.p2c(y) + plot.getPlotOffset().top;
						var pb = series.xaxis.p2c(b) + plot.getPlotOffset().left;
						text = lf ? lf(x-b, series) : x-b;
						
						if (series.labels.position == "outer-end") {
							if (x >= 0) {
								halign = "left";
								px += 5;
							} else {
								halign = "right";
								px -= 5;
							}
						} else if (series.labels.position == "end") {
							if (x >= 0) {
								halign = "right";
								px -= 5;
							} else {
								halign = "left";
								px += 5;
							}
						} else if (series.labels.position == "base") {
							if (x >= 0) {
								halign = "left";
								px = pb + 5;
							} else {
								halign = "right";
								px = pb - 5;
							}
						} else { // middle default
							px = pb + ((px - pb) / 2);
						}
					} else {
						px = series.xaxis.p2c(x) + plot.getPlotOffset().left;
						py = series.yaxis.p2c(y) + plot.getPlotOffset().top;
						var pb = series.yaxis.p2c(b) + plot.getPlotOffset().top;
						text = series.labels.labelFormatter(y - b, series);
						
						if (series.labels.position == "outer-end") {
							if (y >= 0) {
								valign = "bottom";
								py -= 5;
							} else {
								valign = "top";
								py += 5;
							}
						} else if (series.labels.position == "end") {
							if (y >= 0) {
								valign = "top";
								py += 5;
							} else {
								valign = "bottom";
								py -=5;
							}
						} else if (series.labels.position == "base") {
							if (y >= 0) {
								valign = "bottom";
								py = pb - 5;
							} else {
								valign = "top";
								py = pb + 5;
							}
						} else {
							py = pb + ((py - pb) / 2);
						}
					}
					var width = 30; // TODO
					
					barLabels.addText(layer, px, py, text, series.labels.font, angle, width, halign, valign);
				}
			});
			barLabels.render();
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: "barlabels",
		version: "0.1"
	});
})(jQuery);
