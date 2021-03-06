import * as d3 from "d3";
import * as UtilFunction from './util/functions';
import * as NewsUtilFunction from './util/news_functions.js';


export const displayDateInformation = (mouseDate) => {
  fetchAndRender(mouseDate.date);
};




const googleDateUrl = (date) => {
  date = new Date (date);
  let todate = UtilFunction.googleDate(date);

  let url = 'https://newsapi.org/v2/everything?' +
          'q=bitcoin&' +
          `from=${todate}&` +
          `to=${todate}&`  +
          'language=en&' +
          'sortBy=relevancy,popularity&' +
          'pageSize=50&'+
          'apiKey=5262f72651ed4306978a474c55d08c83';
  return url;
};




  const fetchBitCoinNewsbyDate = (date) => {
      let url = googleDateUrl(date);
      window.url = url;
      return $.ajax({
      url: url,
      method: 'GET',
      });
  };

const fetchAndRender = (date) => {
    fetchBitCoinNewsbyDate(date).then(response => {
    window.response = response;
    let bitData = response.articles;
    let words = NewsUtilFunction.arrayOfWords(bitData);
    let counter = NewsUtilFunction.objectCounter(words);
    console.log(counter);
    console.log(words);
    let result = NewsUtilFunction.topWords(30, counter);
    result = (result.length > 60) ? result.slice(0,60) : result;
    renderdateNews(result);
    renderCurrentBitCoinNews(response.articles);
    });
};

export const renderdateNews = (data) => {
  let title = $(".newsVis-title");
  title.html("BitCoin News: Most Used Words");

  let div = d3.select("#newsVis");
  div.selectAll("*").remove();
  if(data.length == 0){
    console.log("no bitcoin data");
    return null;
  }
  window.newsdata = data;
  let width = 600,
  height = 700;
  let svg = d3.select("#newsVis").append("svg")
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
    .attr("class", "words")
    .attr("r", function(d){
      return radiusScale(d.count);
    })
    .attr("fill", "steelblue")
    .attr("stroke", "#fcc118")
    .attr("stroke-width", "3px")
    .attr("cx", 100)
    .attr("cy", 100);

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
            return d.x;
          })
          .attr("cy", function(d){
            return d.y;
          });

      texts.attr('x', (d) => {
          return d.x - (d.word.length)* 2 ;
      })
      .attr('y', (d) => {
          return d.y;
      });

      }
};




export const renderCurrentBitCoinNews = (data) => {
  let settitle = $(".historicalBitcoinNews-title");
  settitle.html("Top Bitcoin News");
  let newsUl = $('.historicalBitcoinNews');
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
