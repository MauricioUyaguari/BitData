var Papa = require('papaparse');
import * as d3 from "d3";
import * as UtilFunction from './util/functions';
import * as lastMonth from './lastMonth';
import * as currentData from './currentData';
import * as currentNews from './currentNews';
window.d3 = d3;


// document.addEventListener('DOMContentLoaded', function () {

  // lastMonth.getData();

// });




const divButtons = document.querySelector(".div-buttons");


divButtons.addEventListener("click", (e) => {
  const buttonChoice = e.target.innerHTML;
  renderBitData(buttonChoice);

});





const renderBitData = (rangeDateInput) => {
  const ranges = UtilFunction.datesRanges(rangeDateInput),
  startDate = ranges[0],
  endDate = ranges[1],
  apiHost = "https://api.coindesk.com/v1/bpi/historical/close.json?start=",
  url = apiHost + startDate + "&end=" + endDate;
  d3.json(url, function(error, data) {
    if(error){
      console.log(error);
    }else {
      data = UtilFunction.dataTransform(data.bpi);
      renderBitChart(data, rangeDateInput);
    }
  });
};



  renderBitData("15d");


const renderBitChart = (data, range) => {
  window.chartdata = data;
  let div = d3.select("#showData");
    div.selectAll("*").remove();

  let margin = {top: 80, right: 50, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  window.data = data;
  let svg = d3.select("#showData").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let y = d3.scaleLinear()
  .rangeRound([height, 0])
  .domain(d3.extent(data, function(d) { return d.close ; })  )
  .nice();

  svg.append("g")
      .call(d3.axisLeft(y).ticks(20))
      .append("text")
      .attr("fill", "gray")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Close Price ($)");


      let x = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, function(d) { return d.date; }));
        // .nice();

      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      let line = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });
        let path = svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
      let focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5).attr("color", "red");

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");



      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      let bisectDate = d3.bisector(function(d) { return d.date; }).left;

          function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
            focus.select("text").text((UtilFunction.formatToCurrency(d.close)));
          }
};


// displays all current Bit Coin Information
currentData.renderCurrent();
setInterval(function(a) {
    console.log("about to render");
    currentData.renderCurrent();
  }, 20000);


// Displays all Current Headlines
currentNews.renderAllCurrentHeadlines();
setInterval(function(a) {
    console.log("about to render all Current News");
    currentNews.renderAllCurrentHeadlines();
  }, 60000);


//
currentNews.renderBitCoinHeadLines();
setInterval(function(a) {
    console.log("about to render all Current News");
    currentNews.renderBitCoinHeadLines();
  }, 60000);







window.googleDate = UtilFunction.googleDate;

const googleDateUrl = (date) => {
  date = new Date (date);
  let todate = UtilFunction.googleDate(date);
  let url = 'https://newsapi.org/v2/everything?' +
          'q=bitcoin&' +
          `from=${todate}&` +
          `to=${todate}&`  +
          'language=en&' +
          'sortBy=popularity&' +
          'pageSize=100&'+
          'apiKey=5262f72651ed4306978a474c55d08c83';
  return url;
};


  const fetchBitCoinNewsbyDate = () => {
      let url = googleDateUrl();
      window.url = url;
      return $.ajax({
      url: url,
      method: 'GET',
      });
  };

fetchBitCoinNewsbyDate(new Date()).then(response => {
  let bitData = response.articles;
  let words = arrayOfWords(bitData);
  console.log(words);
});


const arrayOfWords = (docs) => {
  let result = [];
  let timesHeadlines = [];
  let headline, title, headlineString;
  docs.forEach( info => {
    headlineString = (info.description + info.title).split(" ");
    headlineString = headlineString.filter(UtilFunction.onlyUnique);
    headlineString = UtilFunction.lowerCase(headlineString);
    headlineString = UtilFunction.deleteShortWords(headlineString);
    result = result.concat(headlineString);
  });
  return result;
};
