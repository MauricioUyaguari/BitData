var Papa = require('papaparse');
import * as d3 from "d3";
import * as UtilFunction from './util/functions';
import * as lastMonth from './lastMonth';
import * as currentData from './currentData';

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


currentData.renderCurrent();
setInterval(function(a) {
    console.log("about to render");
    currentData.renderCurrent();
  }, 20000);








  const fetchHeadLines = () => {
      return $.ajax({
      url: "https://newsapi.org/v2/top-headlines?country=us&apiKey=5262f72651ed4306978a474c55d08c83",
      method: 'GET',
      });
    };

    fetchHeadLines().then(response => {
      let data = response.articles;
      renderCurrentAllNews(data);
      debugger
    });


const renderCurrentAllNews = (data) => {
  let newsUl = $('.allNews');
  let title, url, source, newsli, titlediv;
  newsUl.empty();

  data.forEach(newsResponse => {
    title = newsResponse.title;
    url = newsResponse.url;
    source = newsResponse.source.name;
    newsUl.append($("<li>"));
    newsli = (newsUl.children().last());
    debugger
    newsli.append($("<div>").text(`${title}`));
    newsli.append($("<div>").text(`${source}`));
    newsli.wrap('<a href="' + url + '" />');


  }
  );
};





const fetchBitCoinHeadLines = () => {
    return $.ajax({
    url: "https://newsapi.org/v2/top-headlines?q=bitcoin&apiKey=5262f72651ed4306978a474c55d08c83",
    method: 'GET',
    });
  };

  fetchBitCoinHeadLines().then(response => {
    let data = response.articles;
    renderCurrentBitCoinNews(data);
  });




const renderCurrentBitCoinNews = (data) => {
let newsUl = $('.bitcoinNews');
let title, url, source, newsli, titlediv;
newsUl.empty();

data.forEach(newsResponse => {
  title = newsResponse.title;
  url = newsResponse.url;
  source = newsResponse.source.name;
  newsUl.append($("<li>"));
  newsli = (newsUl.children().last());
  newsli.append($("<div>").text(`${title}`));
  newsli.append($("<div>").text(`${source}`));
  newsli.wrap('<a href="' + url + '" />');


}
);
};







// Looks after completing dashboard
//   const timesUrl = (date, page) => {
//     let startDate = new Date (date),
//     endDate = new Date(date);
//     startDate = UtilFunction.nyTimesDate(startDate);
//     endDate = endDate.setDate(endDate.getDate() + 1);
//     endDate = UtilFunction.nyTimesDate(endDate);
//
//     let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
//     url += '?' + $.param({
//       'api-key': "98387c21e9904e889b975064a0a8375e",
//       'begin_date': `${startDate}`,
//       'end_date':  `${endDate}`,
//       'fl': "headline",
//      'fq': "source:(\"The New York Times\") AND type_of_material: (\"News\")",
//       "page": page
//     });
//     return url;
//   };
//
//   const fetchHeadLines = (url) => {
//     window.url = url;
//       return $.ajax({
//       url: url,
//       method: 'GET',
//       });
//     };
//
//
// const renderNews = (date) => {
//   date = new Date (date);
//   let initURL = timesUrl(date, 0);
//   let result = [];
//
//   fetchHeadLines(initURL).then(data => {
//     window.nyt = data;
//     console.log(data);
//     result = result.concat(arrayOfWords(data.response.docs));
//     debugger
//     let steps = data.response.meta.hits;
//     moreRequests(date, steps);
//   });
//
//
//   const moreRequests = (date, steps) => {
//     if( steps <= 10) {
//       return [];
//     }
//     let times;
//     times = parseInt((steps/10));
//     times = (steps % 10 == 0) ? times - 1 : times;
//     let i = 1;
//     let url;
//     while(i <= times){
//       url = timesUrl(date, i);
//       if(i < times){
//         debugger
//         fetchHeadLines(url).then(data => {
//         result = result.concat(arrayOfWords(data.response.docs));
//         });} else {
//           debugger
//         fetchHeadLines(url).then(data => {
//           debugger
//           result = result.concat(arrayOfWords(data.response.docs));
//           window.allResults = result;
//           // wordsToObject(result);
//         });
//       }
//       i += 1;
//     }
//
//   };
// };
//
//
//
//
// renderNews(new Date() );
//
//
//
//
//
//
//
//
//
// const arrayOfWords = (docs) => {
//   let result = [];
//   let timesHeadlines = [];
//   let headline, headlineString;
//   docs.forEach( info => {
//     headline = info.headline;
//     timesHeadlines.push(headline.main);
//     headlineString = (headline.main + headline.print_headline).split(" ");
//     headlineString = headlineString.filter(UtilFunction.onlyUnique);
//     headlineString = UtilFunction.lowerCase(headlineString);
//     headlineString = UtilFunction.deleteShortWords(headlineString);
//     result = result.concat(headlineString);
//   });
//   return result;
// };
//
//
//
// const wordsToObject = (words) => {
//   var rObj = {};
//   var finalArray = [];
//   words.map(function(currentValue, index) {
//     if (rObj.hasOwnProperty(currentValue)) {
//       rObj[currentValue] = rObj[currentValue] + 1;
//     } else {
//       rObj[currentValue] = 1;
//     }
//
//   });
//   for (let keys in rObj) {
//     var obj = {};
//     obj[keys] = rObj[keys];
//     finalArray.push(obj);
//   }
//   return finalArray;
// };
//
// window.wordsToObject = wordsToObject;
//
//
//
//
//
//
//
//
//
//
//
// const renderBitCoinNews = (date) => {
//   const range = UtilFunction.nytImesBitCoin(date, 2);
//   const startDate = range[0],
//         endDate = range[1];
//
//   let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
//   url += '?' + $.param({
//   'api-key': "98387c21e9904e889b975064a0a8375e",
//   'begin_date': `${startDate}`,
//   'end_date': `${endDate}`,
//   'q': 'bitcoin',
//   'sort': "newest",
//   'fl': "body, headline"
//     });
// };
