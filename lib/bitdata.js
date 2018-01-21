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
            // updateLegend(d.date, d.close);
            focus.select("text").text((UtilFunction.formatToCurrency(d.close)));
          }






};



// display current bitcoin data. ajax every minute


const renderCurrent = () => d3.json("https://api.blockchain.info/stats?cors=true", function(error, data) {
  if(error){
    console.log(error);
  }else {
    window.blockchain2 = data;
    renderCurrentData(data);
    renderAdditionalCurrent(data);
  }
});


    const renderCurrentData = (data) => {
      const divTime = $(".bitCoinTime");
      const divDate =  $(".bitCoinDate"),
      divPrice = $('.bitCoinPrice');
      const dateTime = UtilFunction.renderNiceTimeDate(parseInt(data.timestamp));
      let time = dateTime[0];
      let date = dateTime[1];
     divTime.html(time);
     divDate.html(date);
     const price = UtilFunction.formatToCurrency(data.market_price_usd);
     divPrice.html(`${price}`);
    };



    const renderAdditionalCurrent = (data) => {
      let list = $('.current-add-info');
      list.empty();
      let hashrate = UtilFunction.numberWithCommas(data.hash_rate.toFixed(2)),
      totalFeesbtc = UtilFunction.formatToCurrency(data.total_fees_btc),
      btcMined = data.n_btc_mined,
      nTransactions = UtilFunction.numberWithCommas(data.n_tx),
      nBlocksMined = data.n_blocks_mined,
      aMinutesBetweenBlocks = data.minutes_between_blocks.toFixed(2),
      tVolumeUSD = UtilFunction.formatToCurrency(data.estimated_transaction_volume_usd.toFixed(2)),
      minersRevenue = UtilFunction.formatToCurrency(data.miners_revenue_usd.toFixed(2)),
      nextTarget = UtilFunction.numberWithCommas(data.nextretarget),
      difficulty = UtilFunction.numberWithCommas(data.difficulty),
      tradeVolume = UtilFunction.formatToCurrency(data.trade_volume_usd.toFixed(2));

    list.append($("<li>").text(`hashrate: ${hashrate}`));
    list.append($("<li>").text(`Total Transaction Fees: ${totalFeesbtc}`));
    list.append($("<li>").text(`Number of BTC Mined: ${btcMined}`));
    list.append($("<li>").text(`Number of Transactions: ${nTransactions}`));
    list.append($("<li>").text(`Number of Blocks Mined: ${nBlocksMined}`));
    list.append($("<li>").text(`Average Minutes Betweens Block: ${aMinutesBetweenBlocks}`));
    list.append($("<li>").text(`Estimated Transaction Volume USD: ${tVolumeUSD}`));
    list.append($("<li>").text(`Miners Revenue USD: ${minersRevenue}`));
    list.append($("<li>").text(`Next Target: ${nextTarget}`));
    list.append($("<li>").text(`Difficulty: ${difficulty}`));
    list.append($("<li>").text(`Trade Volume USD: ${tradeVolume}`));

    };

    renderCurrent();
    setInterval(function(a) {
      console.log("about to render");
      renderCurrent();
    }, 20000);


let nowTimeDiv = $('.nowTime'),
ahora;
setInterval(function(a){
  ahora = UtilFunction.renderNiceTimeDate(new Date);
  nowTimeDiv.html(ahora[0]);
}, 1000);
