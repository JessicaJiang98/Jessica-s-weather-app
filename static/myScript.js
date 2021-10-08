console.log("This is logging")
$("#display").hide()
// HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
//
// HTMLFormElement.prototype.submit = function (){
//    getLatLng()
//    alert('Deddy Is Great :)'); // or fire the onsubmit event manually
// };

///event listeners
// document.getElementById("button-submit").addEventListener("click",function(){getLatLng()});
document.getElementById("checkbox").addEventListener("click",function(){getIPinfo()});
// document.getElementById("checkbox").addEventListener("change",function(){disableFields()});
// document.getElementById("weatherCharts").addEventListener("click",function(){draw()});
// $("#Street").bind('click',function(){
//   if (!$('#Street').val()) {
//           document.getElementById('Street').setCustomValidity(';haha') ;
//         }
// })

$('#down').bind('click',function(){
  $('#detail').hide()
  $(".downArrow").hide()
  $("#weatherCharts").show()
  draw();
})
$('#up').bind('click',function(){
  $("#weatherCharts").hide()
  $('#detail').show()
  $(".downArrow").show()

})
$("button[name='button-clear']").bind('click',function(){
  $("#display").hide()
  $("input[type='text']").prop('disabled',false)
  $("select").prop('disabled',false)
  document.getElementById("form").reset()
})

$(".record").bind('click',(function(event){
  // console.log('hi')
  $('.weather-card').hide()
  $("#table-hide").hide()
  $("#detail").show()
  $(".downArrow").show()
  var index=$(this).find('td:last').text();
  var detail=day[index]
  console.log('this date',detail)
  var da=new Date(detail.startTime)
  var g=code[detail.values.weatherCode][1]
  document.getElementById("detail-icon").src=`/Images/symbols/${g}.svg`

  $('#d-date').text(da.toDateString())
  $('#d-weather').text(code[detail.values.weatherCode][0])
  $('#d-max').text(detail.values.temperatureMax)
  $('#d-min').text(detail.values.temperatureMin)
  $('#prec').text(precMap[detail.values.precipitationType])
  $('#chan').text(detail.values.precipitationProbability,'%')
  $('#wins').text(detail.values.windSpeed,'mph')
  $("#humi").text(detail.values.humidity,'%')
  $("#visi").text(`${detail.values.visibility}mi`)
  var rise=new Date(detail.values.sunriseTime)
  var set=new Date(detail.values.sunsetTime)
  $("#rise").text(rise.getHours())
  $("#set").text(set.getHours())
}))
// $("#button-submit").bind('click',function(){
//   $("#display").show()
// })


var checkbox = document.querySelector("input[name=checkbox]");

checkbox.addEventListener('change', function() {
  if (this.checked) {
    console.log("Checkbox is checked..");
    $("input[type='text']").prop('disabled',true)
    $("select").prop('disabled',true)
    document.getElementById("Street").value=''
    document.getElementById("City").value=''
    document.getElementById("State").value=''

  } else {
    $("input[type='text']").prop('disabled',false)
    $("select").prop('disabled',false)
  }
});




// function disableFields(){
//   if (document.getElementById("checkbox").checked){
//     document.getElementById("form").disabled=true;
//     document.getElementById("form").reset()
//   }else {
//     document.getElementById("form").disabled=false;
//   }
//
// }
var server="https://jessica-weather-app.wl.r.appspot.com/data"
var ip;
var lat;
var lng;
var selectedValue;
var city;
var country;
var loc;
var formatAddress;
var weather;
var day;
var hour;
var precMap= {
0: "N/A",
1: "Rain",
2: "Snow",
3: "Freezing Rain",
4: "Ice Pellets"
}
const status=["weatherCode","temperature","humidity","pressureSeaLevel","windSpeed","visibility","cloudCover","uvIndex"];
var code={
'4201':["Heavy Rain","heavey_rain"],
'4001':["Rain","rain"],
'4200':["Light Rain","light_rain"],
'6201':["Heavy Freezing Rain","heavey_freezing_rain"],
'6001':["Freezing Rain","freezing_rain"],
'6200':["Light Freezing Rain","light_freezing_rain"],
'6000':["Freezing Drizzle","freezing_drizzle"],
'4000':["Drizzle","drizzle"],
'7101':["Heavy Ice Pellets","heavey_ice_pellets"],
'7000':["Ice Pellets","ice_pellets"],
'7102':["Light Ice Pellets","light_ice_pallets"],
'5101':["Heavy Snow","heavey_snow"],
'5000':["Snow","snow"],
'5100':["Light Snow","light_snow"],
'5001':["Flurries","flurries"],
'8000':["Thunderstorm","thunderstorm"],
'2100':["Light Fog","light_fod"],
'2000':["Fog","fog"],
'1001':["Cloudy","cloudy"],
'1102':["Mostly Cloudy","mostly_cloudy"],
'1101':["Partly Cloudy","partly_cloudy_day"],
'1100':["Mostly Clear","mostly_clear_day"],
'1000':["Clear, Sunny","clear_day"]
}

function disableFields(){
  console.log("Disable the input address fields")
};


///finished
function getSelctedValue(){
  var selectedValue =  document.getElementById("State").value;
  // console.log('getSelctedValue',selectedValue)
}

///geocode would make two api calls, first one get the lat/lng
///second make call to server and get weather data
function geocode(){
  let address='';
  address+=$("#Street").val()
  address+=' '
  address+=$("#City").val()
  address+=' '
  address+=$("#State option:selected").val()

  axios.get("https://maps.googleapis.com/maps/api/geocode/json",
  {params:{
    address:address,
    key:'AIzaSyCI_QxDY3ucy2hRw7RzyKEEN4Cfq85WNU0'
  }
})
.then(function(response){
  var location_result=response.data.results[0].geometry.location
  var lat=location_result.lat
  var lng=location_result.lng
  formatAddress=response.data.results[0]["formatted_address"]
  loc = `${lat},${lng}`
  // console.log(response)
  console.log('geocode function loc',loc)
  // haha="http://127.0.0.1:8080/data"
  haha="https://jessica-weather-app.wl.r.appspot.com/data"
  axios.get(haha,
    {params:{
      loc:loc
    }}).then((response)=>{
      // console.log(response.data);
      weather=response.data.data.timelines
      hour=weather[0].intervals
      day=weather[1].intervals
      displayWeatherCard()
      displayWeatherTb()

    })
})
.catch(function(error){
  console.log(error);
});
  return false
}

/////finished, return ip address data

function getIPinfo(){
  fetch('https://ipinfo.io?token=a42a1e24fd11a1')
    .then(res => res.json())
    .then(data => ip = data)
    .catch(function(error){
      console.log(error)
      alert(error)
    })
};

function test(){

  console.log("happending")
  return false
}
// $("#button-submit").bind("click",test())
function getLatLng(){
  // event.preventDefault();
  $("#display").show()
  $("#detail").hide()
  $(".downArrow").hide()
  $("#weatherCharts").hide()
  $(".weather-card").show()
  $(".table-hide").hide()

  // console.log("getLatLng function called")
  ////if checkbox checked, get ip info and set lat lng
  if (document.getElementById('checkbox').checked) {
    console.log("Checked, getipinfo");
    getIPinfo()
    loc=ip.loc
    console.log(loc)
    city=ip.city
    country=ip.country
    var region=ip.region
    var postal=ip.postal
    formatAddress=city +' '+region+' '+postal+','+country

    // console.log('full ip data',ip)
    if (loc !==null){
      host="https://jessica-weather-app.wl.r.appspot.com/data"
      // host="http://127.0.0.1:8080/data"
      axios.get(host,
        {params:{
          loc:loc
        }}).then((response)=>{
          // console.log(response.data)
          weather=response.data.data.timelines
          hour=weather[0].intervals
          day=weather[1].intervals
          // console.log(day)
          displayWeatherCard()
          displayWeatherTb()
        }).catch(function(error){
              console.log(error)
              alert("Not valid input or API call reached limit")
            });}
  }else {
    geocode();
    // console.log("geocode function executed and loc",loc)
    };
    return false
  }


  ////dsiplay table

function displayWeatherCard(){

  $(".weather-card").show()
  $(".table-hide").hide()
  if (weather !== null){
    var today=day[0].values

    status.forEach(function(x){
      $(`#${x}`).text(today[`${x}`])
      // console.log(today[`${x}`])
    $('#location').text(`${formatAddress}`)

    });
  }

}

function displayWeatherTb(){
  $(".weather-card").show()
  $(".table-hide").hide()
  $('#table-hide').show()
  if (weather !==null){
    var table=document.getElementById("weatherTable")

    // console.log(day,"displayWeatherTb")
    var dic={};
    table.innerHTML=``

    for (var i=0;i<day.length; i++){
      var d=new Date(day[i].startTime)
      var codeResult=day[i].values.weatherCode
      var s=code[codeResult][0]
      var m=code[codeResult][1]
      // document.getElementById('weatherCode').text=s
      $("#weatherCode").text(s);
      document.getElementById("today-weather-graph").src=`/Images/symbols/${m}.svg`

      var row=`<tr class='record' href="#detail">
                  <td class='date'> <br> ${d.toDateString()}</td>
                  <td><span><img src="/Images/symbols/${m}.svg">
                  </img></span>${s}
                  </td>
                  <td> <br>${day[i].values.temperatureMax}</td>
                  <td> <br>${day[i].values.temperatureMin}</td>
                  <td> <br>${day[i].values.windSpeed}</td>
                  <td class='hide'>${i}</td>
                  </tr>
                  `
      table.innerHTML+=row
    ;
    }
    $(".record").bind('click',(function(event){
      // console.log('hi')
      $('#weather-card').hide()
      $("#table-hide").hide()
      $(".table-hide").hide()
      $("#detail").show()
      $(".downArrow").show()
      var index=$(this).find('td:last').text();
      var detail=day[index]
      // console.log('this date',detail)
      var da=new Date(detail.startTime)
      var g=code[detail.values.weatherCode][1]
      document.getElementById("detail-icon").src=`/Images/symbols/${g}.svg`

      $('#d-date').text(da.toDateString())
      $('#d-weather').text(code[detail.values.weatherCode][0])
      $('#d-max').text(detail.values.temperatureMax,"°F")
      $('#d-min').text(detail.values.temperatureMin,"°F")
      $('#prec').text(precMap[detail.values.precipitationType])
      $('#chan').text(detail.values.precipitationProbability,'%')
      $('#wins').text(detail.values.windSpeed,'mph')
      $("#humi").text(detail.values.humidity,'%')
      $("#visi").text(`${detail.values.visibility}mi`)
      var rise=new Date(detail.values.sunriseTime)
      var set=new Date(detail.values.sunsetTime)
      $("#rise").text(rise.getHours())
      $("#set").text(set.getHours())
    }))

  }
}

var x="°"

/////Highchart graph #1
function draw1(data){
    var list=[]
    data.forEach((node, i) => {
      list.push([Date.parse(node.startTime),node.values.temperatureMax,node.values.temperatureMin])
    });
    Highcharts.chart('area', {
        chart: {
            type: 'arearange',
            zoomType: 'x',
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },
        title: {
            text: 'Temperature variation by day'
        },

        xAxis: {
          type: 'datetime',
          tickInterval: (24*3600*1000)

        },

            plotOptions: {
    series: {
        fillColor: {
            linearGradient: {x1: 0, x2: 0, y1: 0, y2: 0.8},
            stops: [
                [0, '#ffa40a'],
                [1, 'rgba(178, 218, 233, 0.50)']
            ]
        }
    }
    },

        yAxis: {
            title: {
                text: null
            },
            tickInterval:5
        },

        tooltip: {
            crosshairs: true,
            shared: false,
            valueSuffix: '°C',
            xDateFormat: '%A, %b %e'
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            data: list
        }
        ]

    })
  };

///highchart graph #2
function Meteogram(json, container) {
// Parallel arrays for the chart data, these are populated as the JSON file
// is loaded
  this.humidity = [];
  this.winds = [];
  this.temperatures = [];
  this.pressures = [];

  this.json = json;
  this.container = container;

  this.parseYrData();
}
Meteogram.prototype.createChart = function() {
  this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
    this.onChartLoad(chart);
  });
};

Meteogram.prototype.error = function() {
    document.getElementById('loading').innerHTML =
      '<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
  };
Meteogram.prototype.pa
rseYrData = function() {
  let pointStart;
  if (!this.json) {
  return this.error();
  }
  // console.log(this.json.data.timelines[0].intervals)
  this.json.data.timelines[0].intervals.forEach((node, i) => {
  // console.log(node)
  var values=node.values
  const x = Date.parse(node.startTime)
  // console.log(values)

  this.temperatures.push({
    x,
    y: values.temperature
    // custom options used in the tooltip formatter
  });

  this.humidity.push({
    x,
    y: values.humidity
  });

  if (i % 2 === 0) {
    this.winds.push({
      x,
      value: values.windSpeed,
      direction: values.windDirection
    });
  }

  this.pressures.push({
    x,
    y: values.pressureSeaLevel
  });
  });
  this.createChart();
  };
Meteogram.prototype.drawBlocksForWindArrows = function(chart) {
  const xAxis = chart.xAxis[0];

  for (
    let pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5,
    i += 1
  ) {

    // Get the X position
    const isLast = pos === max + 36e5,
      x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

    // Draw the vertical dividers and ticks
    const isLong = this.resolution > 36e5 ?
      pos % this.resolution === 0 :
      i % 2 === 0;

    chart.renderer
      .path([
        'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
        'L', x, chart.plotTop + chart.plotHeight + 32,
        'Z'
      ])
      .attr({
        stroke: chart.options.chart.plotBorderColor,
        'stroke-width': 1
      })
      .add();
  }

  // Center items in block
  chart.get('windbarbs').markerGroup.attr({
    translateX: chart.get('windbarbs').markerGroup.translateX
  });

};

Meteogram.prototype.getChartOptions = function() {
  return {
    chart: {
      renderTo: this.container,
      marginBottom: 70,
      marginRight: 40,
      marginTop: 50,
      plotBorderWidth: 1,
      height: 310,
      alignTicks: false,
      scrollablePlotArea: {
        minWidth: 720
      }
    },

    /*   defs: {
          patterns: [{
              id: 'precipitation-error',
              path: {
                  d: [
                      'M', 3.3, 0, 'L', -6.7, 10,
                      'M', 6.7, 0, 'L', -3.3, 10,
                      'M', 10, 0, 'L', 0, 10,
                      'M', 13.3, 0, 'L', 3.3, 10,
                      'M', 16.7, 0, 'L', 6.7, 10
                  ].join(' '),
                  stroke: '#68CFE8',
                  strokeWidth: 1
              }
          }]
      },
       */
    title: {
      text: 'Hourly Weather for next five days',
      align: 'center',
      style: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },



    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br>'


    },

    xAxis: [{ // Bottom X axis
      type: 'datetime',
      tickInterval: 2 * 36e5, // two hours
      minorTickInterval: 36e5, // one hour
      tickLength: 0,
      gridLineWidth: 1,
      gridLineColor: 'rgba(128, 128, 128, 0.1)',
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0,
      offset: 30,
      showLastLabel: true,
      labels: {
        format: '{value:%H}'
      },
      crosshair: true
    }, { // Top X axis
      linkedTo: 0,
      type: 'datetime',
      tickInterval: 24 * 3600 * 1000,
      labels: {
        format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
        align: 'left',
        x: 3,
        y: -5
      },
      opposite: true,
      tickLength: 20,
      gridLineWidth: 1
    }],

    yAxis: [{ // temperature axis
      title: {
        text: null
      },
      labels: {
        format: '{value}°',
        style: {
          fontSize: '10px'
        },
        x: -3
      },
      plotLines: [{ // zero plane
        value: 0,
        color: '#BBBBBB',
        width: 1,
        zIndex: 2
      }],
      maxPadding: 0.3,
      minRange: 8,
      tickInterval: 1,
      gridLineColor: 'rgba(128, 128, 128, 0.1)'

    }, { // precipitation axis
      title: {
        text: null
      },
      labels: {
        enabled: false
      },
      gridLineWidth: 0,
      tickLength: 0,
      minRange: 10,
      min: 0

    }, { // Air pressure
      allowDecimals: false,
      title: { // Title on top of axis
        text: 'inHg',
        offset: 0,
        align: 'high',
        rotation: 0,
        style: {
          fontSize: '10px',
          color: '#f9b520'

        },
        textAlign: 'left',
        x: 3
      },
      labels: {
        style: {
          fontSize: '8px',
          color:" #f9b520"

        },
        y: 2,
        x: 3
      },
      gridLineWidth: 0,
      opposite: true,
      showLastLabel: false
    }],

    legend: {
      enabled: false
    },

    plotOptions: {
      series: {
        pointPlacement: 'between'
      }
    },


    series: [{
        name: 'Temperature',
        data: this.temperatures,
        type: 'spline',
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.y}°F</b><br/>'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
      },
      {
        name: 'Humidity',
        data: this.humidity,
        type: 'column',
        color: '#68CFE8',
        yAxis: 1,
        groupPadding: 0,
        pointPadding: 0,
        grouping: false,
        dataLabels: {
          enabled: true,
          filter: {
            operator: '>',
            property: 'y',
            value: 0
          },
          style: {
            fontSize: '8px',
            color: 'gray'
          }
        },
        tooltip: {
          valueSuffix: ' mm'
        }
      }, {
        name: 'Air pressure',
        color: "#f9b520",
        data: this.pressures,
        marker: {
          enabled: false
        },
        shadow: false,
        tooltip: {
          valueSuffix: ' inHg'
        },
        dashStyle: 'shortdot',
        yAxis: 2
      }, {
        name: 'Wind',
        type: 'windbarb',
        id: 'windbarbs',
        color: Highcharts.getOptions().colors[1],
        lineWidth: 1.5,
        data: this.winds,
        vectorLength: 10,
        yOffset: -15,
        tooltip: {
          valueSuffix: ' mph'
        }
      }
    ]
  };
};

Meteogram.prototype.onChartLoad = function(chart) {

  /*  this.drawWeatherSymbols(chart); */
  this.drawBlocksForWindArrows(chart);

};
Meteogram.prototype.parseYrData = function() {
  let pointStart;
  if (!this.json) {
    return this.error();
  }
  // console.log('here',this.json.data.timelines[0].intervals)
  this.json.data.timelines[0].intervals.forEach((node, i) => {
    // console.log(node)
    var values=node.values
    const x = Date.parse(node.startTime)
    // console.log(values)

    this.temperatures.push({
      x,
      y: values.temperature
      // custom options used in the tooltip formatter
    });

    this.humidity.push({
      x,
      y: values.humidity
    });

    if (i % 2 === 0) {
      this.winds.push({
        x,
        value: values.windSpeed,
        direction: values.windDirection
      });
    }

    this.pressures.push({
      x,
      y: values.pressureSeaLevel
    });
  });
  this.createChart();
};
function draw2(l){
  l=loc
  var api_address = `https://api.tomorrow.io/v4/timelines?location=${l}&fields=temperature,humidity,pressureSeaLevel,windSpeed,windDirection&units=imperial&timesteps=1h&apikey=VuUsvG3cUAngCCgRd0CmhRkWyPJPaJYF`;
  if (l!==undefined){
    axios.get(api_address).then(function(response){
      data=response.data
      window.meteogram = new Meteogram(data, 'hour')}).catch(function(error){
            console.log(error)
          })
  }

};

function draw(){

  draw1(day)
  draw2(loc)
  $("#detailCard-wrapper").hide()
}






/////////////////
