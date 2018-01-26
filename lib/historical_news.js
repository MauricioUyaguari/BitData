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
          'sortBy=popularity&' +
          'pageSize=100&'+
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
    let words = arrayOfWords(bitData);
    let counter = objectCounter(words);
    console.log(counter);
    console.log(words);
    let result = NewsUtilFunction.topWords(10, counter);
    renderdateNews(result);
    });
};

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




const objectCounter = (arrayWords) => {
  let uniqueWords = arrayWords.filter(UtilFunction.onlyUnique);
  let result = [];
  let temp ;
  let count;
  uniqueWords.forEach(word => {
    temp = {};
    count = countInArray(arrayWords, word);
    temp["word"] = word;
    temp["count"] = count;
    result.push(temp);
  });
  return result;
};


const countInArray = (array, what) => {
  return array.filter(item => item == what).length;

};



export const renderdateNews = (data) => {
  window.newsdata = data;
  let width = 800,
  height = 800;
  let div = d3.select("#newsVis");
  div.selectAll("*").remove();
  let svg = d3.select("#newsVis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");
    let max = data[0].count;
    let min = data[data.length-1].count;
    let radiusScale = d3.scaleSqrt().domain([min, max]).range([10,100]);

    let simulation = d3.forceSimulation()
    .force("x", d3.forceX(width/2).strength(0.05))
    .force("y", d3.forceY(height/2).strength(0.05))
    .force("collide", d3.forceCollide( function(d){
      return radiusScale(d.count);
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
    .attr("cx", 100)
    .attr("cy", 100);

    let texts = svg.selectAll(null)
        .data(data)
        .enter()
        .append('text')
        .text(d => d.word)
        .attr('color', 'black')
        .attr('font-size', 15);

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
          return d.x - 5;
      })
      .attr('y', (d) => {
          return d.y;
      });

      }
};
