import * as UtilFunction from './util/functions';

let nowTimeDiv = $('.nowTime'),
ahora;
setInterval(function(a){
  ahora = UtilFunction.renderNiceTimeDate(new Date);
  nowTimeDiv.html(ahora[0]);
}, 1000);



export const renderCurrent = () => d3.json("https://api.blockchain.info/stats?cors=true", function(error, data) {
  if(error){
    console.log(error);
  }else {
    window.blockchain2 = data;
    renderCurrentData(data);
    renderAdditionalCurrent(data);
  }
});


export const renderCurrentData = (data) => {
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


export const renderAdditionalCurrent = (data) => {
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
