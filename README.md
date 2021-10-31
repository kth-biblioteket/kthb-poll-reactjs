# KTHB Poll
Lova att göra skillnad för saker

## Funktioner
Visar röster

### Bygg react applikation ###
npm run build
Skapa en config.js med följande info:
```
var api_url = "https://lib.kth.se"
var eventid = 1;

var w = window.innerWidth;
var h = window.innerHeight;

var innerRadius = '40%'
var outerRadius = '60%'
var labelFontsize = 50
var countNumberFontsize = 90
var countTextFontsize = 60
var headingFontsize = 70

if (w < 1000 ) {
    labelFontsize = 40
    countNumberFontsize = 90
    countTextFontsize = 40
    headingFontsize = 60
}
if (w > 1900 ) {
    labelFontsize = 70
    countNumberFontsize = 110
    countTextFontsize = 80
    headingFontsize = 90
}

appsettings = {
  screenwidth: w,
    screenheight: h,
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    pieCx: '50%',
    pieCy: '50%',
    pieTop: 50,
    labelFontsize: labelFontsize,
    headingTop: 20,
    headingLeft: 40,
    headingFontsize: headingFontsize,
    countNumberFontsize: countNumberFontsize,
    countTextFontsize: countTextFontsize
}

var styleNode = document.createElement('style');
styleNode.type = "text/css";

var css =  `.background {
    position: absolute;
    top: 0;
    left: 0;
    width: ${w}px;
    height: ${h}px;
}`
   // browser detection (based on prototype.js)
   if(!!(window.attachEvent && !window.opera)) {
        styleNode.styleSheet.cssText = css;
   } else {
        var styleText = document.createTextNode(css);
        styleNode.appendChild(styleText);
   }
   document.getElementsByTagName('head')[0].appendChild(styleNode);

var lang = {
    heading: 'We promise to improve...',
    pledges: 'Promises',
    categories: {
      Clothing: 'Clothing',
      Travels: 'Plants',
      Purchases: 'Things',
      Food: 'Food',
      Living: 'Education'
    }
}

var settings = {
  Food: {
    value: 1,
    color: '#cedb29',
    icon: 'food_icon.png'
  },
  Clothing: {
    alue: 1,
    color: '#5cb7b3',
    icon: 'water_icon.png'
  },
  Travels: {
    value: 1,
    color: '#146170',
    icon: 'transportation_icon.png'
  },
  Purchases: {
    value: 1,
    color: '#a65a95',
    icon: 'habitat_icon.png'
  },
  Living: {
    value: 1,
    color: '#cb7d31',
    icon: 'energy_icon.png'
  }
}

```

Se till att publicera en index.html på webserver där sidan ska visas enligt exemplet nedan:
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="favicon.ico">
    <title>KTH Biblioteket</title>
    <style type="text/css">

    * {
      overflow: hidden;
    }

	 	p {
		  animation-duration: 3s;
		  animation-name: slidein;
		}

		.background {
			position: absolute;
        	top: 0;
        	left: 0;
        	width: 1920px;
        	height: 1080px;
		}
	  
    </style>
  </head>
  <body>
  	<img 
      src='a224f25e08101d32f72a9fcd6d0b5ddd.jpg'
      class="background"
    />
    <div id="piechart"></div>
  </body>
  <script src="config.js"></script>
	<script src="bundle.js"></script>
</html>
```