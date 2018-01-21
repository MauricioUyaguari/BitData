import * as UtilFunction from './util/functions';


export const renderCurrentBitData = () => d3.json("https://api.coindesk.com/v1/bpi/currentprice.json", function(error, data) {
  if(error){
    console.log(error);
  }else {
    window.currentprice = data;
    renderCurrent(data);
  }
});


export const renderCurrent = (data) => {
  console.log("hello");
  const dateTime = UtilFunction.renderNiceTimeDate(data.time.updated),
  time = dateTime[0],
  date = dateTime[1];
  const price = data.bpi.USD.rate;

  const divTime = $(".bitCoinTime"),
    divDate =  $(".bitCoinDate"),
   divPrice = $('.bitCoinPrice');

   divTime.html(time);
   divDate.html(date);
   divPrice.html(` $ ${price}`);
};
