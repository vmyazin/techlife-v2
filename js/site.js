
let xmlText,
    episodeList;

let mustache = require('mustache');

function parseXML2(data) {
  var parseString = require('xml2js').parseString;
  parseString(data, function (err, w) {
    episodeList = getEpisodeList(w);
    renderList(episodeList);

    // select the lastest episode on load
    let latestEpisodeNum = episodeList[0].episodeNum;
    showDetails(event, episodeList, {showEpisodeNum: latestEpisodeNum, scrollToSelected: false});
  });
}

function getEpisodeList(data) {
  let moment = require('moment');
  require('moment/locale/ru');

  const episodeList = data.rss.channel[0].item.map(episode => {
    const episodeNumber = episode.title[0].split(":")[0];
    episode.episodeNum = episodeNumber.replace("#",""); // add clean episode number
    episode.title = episode.title[0].replace(episodeNumber + ": ", ""); // add clean episode title
    episode.pubDateConverted = moment(episode.pubDate[0]).locale('ru').format("LL"); // add neat episode date in Russian
    return episode;
  });

  return episodeList;
}

showDetails = (e, episodeList, properties) => {
  e.preventDefault();

  renderList(episodeList);

  num = properties.showEpisodeNum + ''; // update var JS type

  // get item with the given episode number
  var selectedItem = episodeList.find(obj => {
    return obj.episodeNum === num;
  });

  var template = '<div class="selected-box"><h3><span class="episode-num">№{{episodeNum}}</span> <a href="episodes/{{episodeNum}}">{{title}}</a> <span class="small-caps date">{{pubDateConverted}}</span></h3>{{{description.0}}}</div>';
  let tplOutput = mustache.to_html(template, selectedItem);

  // insert selected item HTML into current LI
  let currentLi = document.getElementsByClassName('episode-' + num)[0];
  currentLi.classList.add('selected');
  currentLi.innerHTML = tplOutput;
  if (properties.scrollToSelected) smoothScroll(currentLi);
}

function renderList(episodeList) {
  var template = "{{#.}}<li class='episode-{{episodeNum}}'><span class='episode-num'>№{{episodeNum}}</span> <a onclick='showDetails(event, " + JSON.stringify(episodeList) + ", {showEpisodeNum: {{episodeNum}}, scrollToSelected: true})' href='javascript:void(0)'>{{title}}</a></li>{{/.}}";
  var tplOutput = mustache.to_html(template, episodeList);

  // insert HTML into UL
  let listEl = document.getElementById('episode-list');
  listEl.innerHTML = tplOutput;
}

window.smoothScroll = function(target) {
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 700);
}

// run on page ready
$(function() {
  $.ajax({
    url: 'http://techlifepodcast.com/podcast-feed.xml',
    type: 'GET',
    dataType: 'text',
    timeout: 1000,
    error: function(){
      alert('Error loading XML document');
    },
    success: function(xmlText) {
      parseXML2(xmlText);
    }
  });
});
