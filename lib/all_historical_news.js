import * as d3 from "d3";
import * as UtilFunction from './util/functions';
import * as NewsUtilFunction from './util/news_functions.js';



export const displayHistoricalFinancialNews = (mouseDate) => {
  let newsUl = $('.historicalAllNews');
  newsUl.empty();
  fetchAndRenderAll(mouseDate.date);
};


const financialTimesUrl = (date) => {
  date = new Date (date);
  let todate = UtilFunction.googleDate(date);

  let url = 'https://newsapi.org/v2/everything?' +
          'sources=financial-times&' +
          `from=${todate}&` +
          `to=${todate}&`  +
          'language=en&' +
          'sortBy=popularity&' +
          'pageSize=50&'+
          'apiKey=5262f72651ed4306978a474c55d08c83';
      window.url = url;
  return url;

};



const nyTimesUrl = (date) => {
  date = new Date (date);
  let todate = UtilFunction.googleDate(date);

  let url = 'https://newsapi.org/v2/everything?' +
          'sources=the-new-york-times&' +
          `from=${todate}&` +
          `to=${todate}&`  +
          'language=en&' +
          'sortBy=popularity&' +
          'pageSize=50&'+
          'apiKey=5262f72651ed4306978a474c55d08c83';
    window.nytime = url;
  return url;
};

const fetchHistoricalFinancialNews = (date) => {
    let url = financialTimesUrl(date);
    return $.ajax({
    url: url,
    method: 'GET',
    });
};


const fetchAndRenderAll = (date) => {
    fetchHistoricalFinancialNews(date).then(response => {
    if( response.totalResults < 10 ){
      return null;
    }
    responseToShow(response);
    });
};




  const responseToShow = (response) => {
    let bitData = response.articles;
    let words = NewsUtilFunction.arrayOfWords(bitData);
    let counter = NewsUtilFunction.objectCounter(words);
    console.log(counter);
    console.log(words);
    let result = NewsUtilFunction.topWords(30, counter);
    result = (result.length > 60) ? result.slice(0,60) : result;
    renderAllDateNews(result);
    renderAllHistoricalList(response.articles);
  };




export const renderAllDateNews = (data) => {
  let title = $(".allNewsVis-title");
  title.html("All News: Most Used Words");

  let div = d3.select("#allNewsVis");
  div.selectAll("*").remove();
  if(data.length == 0){
    console.log("display new york times");
    return null;
  }
  let width = 600,
  height = 700;

  let svg = d3.select("#allNewsVis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");
    let max = data[0].count;
    let min = data[data.length-1].count;
    let radiusScale = d3.scaleSqrt().domain([min, max]).range([20,60]);

    let simulation = d3.forceSimulation()

    .force("x", d3.forceX(width/2).strength(0.05))
    .force("y", d3.forceY(height/2).strength(0.05))
    .force("collide", d3.forceCollide( function(d){
      return radiusScale(d.count) + 3;
    }));

    let circles = svg.selectAll(".words")
    .data(data)
    .enter()
    .append('circle')
    .attr("class", "historical")
    .attr("r", function(d){
      return radiusScale(d.count);
    })
    .attr("fill", "steelblue")
    .attr("stroke", "#fcc118")
    .attr("stroke-width", "3px")
    .attr("cx", "600")
    .attr("cy", "100");

    let texts = svg.selectAll(null)
        .data(data)
        .enter()
        .append('text')
        .text(d => d.word)
        .attr('stroke', '0px')
        .attr('fill', '#DC143C')

        .attr('font-size', 12);

  let nodes = simulation.nodes(data)
      .on('tick', ticked);

      function ticked() {
        circles
          .attr("cx", function(d) {
            return d.x ;
          })
          .attr("cy", function(d){
            return d.y ;
          });

      texts.attr('x', (d) => {
          return d.x - (d.word.length) * 2;
      })
      .attr('y', (d) => {
          return d.y;
      });

      }
};



export const renderAllHistoricalList = (data) => {
  let settitle = $(".historicalAllNews-title");
  settitle.html("Top Historical News");
  let newsUl = $('.historicalAllNews');
  let title, url, source, newsli, titlediv, timeFormat, imgUrl;
  newsUl.empty();
  data = data.slice(0,10);
  data.forEach(newsResponse => {
    title = newsResponse.title;
    url = newsResponse.url;
    source = newsResponse.source.name;
    timeFormat = UtilFunction.renderTimeHoursMinutes(newsResponse.publishedAt);
    imgUrl = newsResponse.urlToImage;
    newsUl.append($("<li>").addClass("bitcoinNews-li"));
    newsli = (newsUl.children().last());
    if( imgUrl == null){
      newsli.append(`<img width="50px" height="50px" src="./images/bitcoin.jpg"/>`);
    } else {
      newsli.append(`<img width="50px" height="50px" src="${imgUrl}"/>`);
    }
    newsli.append(`<div>
                    <p> <a href="${url}" > ${title} </a> </p>
                    <div> Source: ${source} </div>
                    <div> Updated: ${timeFormat} </div>
                  </div>`);
  });
};
