flot.barlabels
==============

[Flot](http://www.flotcharts.org) plugin that adds value labels to bar charts.  The appearance and position of the bar labels are customizable through several options.

![alt tag](https://cloud.githubusercontent.com/assets/1497949/5026597/8fe3eb20-6ada-11e4-8a42-211e218ff996.png)

## Installation ##
Download [jquery.flot.barlabels.js](https://raw.githubusercontent.com/cleroux/flot.barlabels/master/jquery.flot.barlabels.js) and place the following script tag after flot's script tags:
```html
<script type="text/javascript" src="[...]/jquery.flot.barlabels.js"></script>
```

## Options ##
Options can be set in the series options for the plot or within each series object individually.
```js
series: {
	labels: {
		show: boolean
		font: string or font spec
		labelFormatter: null or (fn: string, series object -> string)
		position: string,
		padding: number
	}
}
```

### show ###
Specifies whether or not to show value labels.  
Value: true or false  
Default: true
### font ###
Specifies the font style to use for the labels.  This option works the same as flot's font options, accepting a CSS class name or a font object.  See [flot documentation](https://github.com/flot/flot/blob/master/API.md#customizing-the-axes) for details.  
Default: The default canvas font. The default CSS class applied to bar labels is 'flot-bar-label'
### labelFormatter ###
A function that allows custom formatting or manipulation of the value that will be displayed on each bar.  
Default: Function simply returns the value.
### position ###
Specifies where the label should be drawn on each bar.  These values function consistently whether the bar chart is vertical or horizontal, whether the values are positive or negative, or if the bars do not use zero as their baseline.  
If the label does not fit inside the bar when using base, middle, or end positions, the position for that label is moved outside.  
Acceptable values are 'base', 'middle', 'end', 'outside'  
'base' positions the labels inside the end of the bar which is closest to the baseline.  
'middle' positions the label at the center of bar along its length.  
'end' positions the label inside the bar at the end which is furthest from the baseline.  
'outside' positions the label outside the end of the bar.  
Default: middle
### padding ###
Specifies the padding used to position labels when using base, end, or outside positions.  
Default: 4 pixels
