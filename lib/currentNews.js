import * as UtilFunction from './util/functions';

export const renderAllCurrentHeadlines = () => {
  fetchHeadLines().then(response => {
    let data = response.articles;
    renderCurrentAllNews(data);
  });
};

const fetchHeadLines = () => {
    return $.ajax({
    url: "https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=5262f72651ed4306978a474c55d08c83",
      method: 'GET',
      });
};
const renderCurrentAllNews = (data) => {
  let newsUl = $('.allNews');
  let title, url, source, newsli, titlediv, timeFormat;
  newsUl.empty();
  data = data.slice(0,10);
  data.forEach(newsResponse => {
    title = newsResponse.title;
    url = newsResponse.url;
    // source = newsResponse.source.name;
    timeFormat = UtilFunction.renderTimeHoursMinutes(newsResponse.publishedAt);
    newsUl.append($("<li>"));
    newsli = (newsUl.children().last());
    newsli.append($("<div>").text(`${title}`));
    newsli.append($("<div>").text(`${source}`));
    newsli.append($("<div>").text(`${timeFormat}`));
    newsli.wrap('<a href="' + url + '" />');

  }
  );
};




export const renderBitCoinHeadLines = () => {
  fetchBitCoinHeadLines().then(response => {
    let data = response.articles;
    renderCurrentBitCoinNews(data);
  });
};


const fetchBitCoinHeadLines = () => {
    return $.ajax({
    url: "https://newsapi.org/v2/top-headlines?q=bitcoin&apiKey=5262f72651ed4306978a474c55d08c83&cors=true",
    method: 'GET',
    });
  };



  const renderCurrentBitCoinNews = (data) => {
    let newsUl = $('.bitcoinNews');
    let title, url, source, newsli, titlediv, timeFormat;
    newsUl.empty();
    data = data.slice(0,10);
    data.forEach(newsResponse => {
      title = newsResponse.title;
      url = newsResponse.url;
      source = newsResponse.source.name;
      timeFormat = UtilFunction.renderTimeHoursMinutes(newsResponse.publishedAt);
      newsUl.append($("<li>"));
      newsli = (newsUl.children().last());
      newsli.append($("<div>").text(`${title}`));
      newsli.append($("<div>").text(`${source}`));
      newsli.append($("<div>").text(`${timeFormat}`));
      newsli.wrap('<a href="' + url + '" />');
    });
  };
