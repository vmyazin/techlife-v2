window.app = window.app || {};

let xmlText,
    episodeList,
    listEl;

let mustache = require('mustache');

function parseXML2(data) {
  var parseString = require('xml2js').parseString;
  parseString(data, function (err, w) {
    episodeList = window.episodeList = getEpisodeList(w);
    renderList(episodeList);

    // select the lastest episode on load
    let latestEpisodeNum = episodeList[0].episodeNum;
    showDetails(window.event, episodeList, {showEpisodeNum: latestEpisodeNum, scrollToSelected: false});
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

  var template = '<div class="selected-box"><h3><span class="episode-num">№{{episodeNum}}</span> <a href="./#/{{episodeNum}}">{{title}}</a> <span class="small-caps date">{{pubDateConverted}}</span></h3><section class="episode-desc">{{{description.0}}}<div class="player"><p id="play" class="btn-play">Play</p></div></section></div>';
  
  let tplOutput = mustache.to_html(template, selectedItem);

  // insert selected item HTML into current LI
  let currentLi = document.getElementsByClassName('episode-' + num)[0];
  currentLi.classList.add('selected');
  currentLi.innerHTML = tplOutput;

  initAudioPlayer(selectedItem.enclosure[0].$.url);
  
  if (properties.scrollToSelected) smoothScroll(currentLi);
}

showEpisodeInfo = (episodeList, properties) => {
  renderList(episodeList);

  num = properties.showEpisodeNum + ''; // update var JS type

  // get item with the given episode number
  var selectedItem = episodeList.find(obj => {
    return obj.episodeNum === num;
  });

  console.log(selectedItem);

  smoothScroll($('body'));

  var template = '<h3><span class="small-caps date">12 декабря 2018 г.</span></h3><h2>№{{episodeNum}} {{title}}</h2><p class="m-b-2"><a href="{{enclosure.0.$.url}}"><span class="mask-link-style"><img src="public/images/icon-download.svg" alt="Download"> </span>Скачать</a><div class="player"><p id="play" class="btn-play">Play</p></div></p><section class="episode-desc">{{{description.0}}}</section></div>';
  
  let tplOutput = mustache.to_html(template, selectedItem);

  // insert selected item HTML into view
  document.getElementById('episode-details').innerHTML = tplOutput;

  initAudioPlayer(selectedItem.enclosure[0].$.url);
}

function renderList(episodeList) {
  var template = "{{#.}}<li class='episode-{{episodeNum}}'><span class='episode-num'>№{{episodeNum}}</span> <a onclick='showDetails(event, " + JSON.stringify(episodeList) + ", {showEpisodeNum: {{episodeNum}}, scrollToSelected: true})' href='javascript:void(0)'>{{title}}</a></li>{{/.}}";
  var tplOutput = mustache.to_html(template, episodeList);

  // insert HTML into UL
  listEl.innerHTML = tplOutput;
}

initAudioPlayer = (file) => {
  soundManager.destroySound('audio');
  soundManager.setup({
    debugMode: false,
    onready: function() {
      let currentAudio = soundManager.createSound({
        id: 'audio',
        url: file
      });

      let playBtn = document.getElementsByClassName('btn-play')[0];

      playBtn.addEventListener('click', function() {        
        if (currentAudio.playState === 0 || currentAudio.paused === true) {       currentAudio.play();
          this.classList.add('is-playing');
        } else {
          currentAudio.pause();
          this.classList.remove('is-playing');
        }
      });
    },
    ontimeout: function() {
      console.log('player timeout');
      soundManager.reboot();
    }
  });
}

window.smoothScroll = function(target) {
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 700);
}

window.loadFeed = () => {
  $.ajax({
    url: 'archive-feed.xml',
    type: 'GET',
    dataType: 'text',
    timeout: 2000,
    error: function(){
      listEl.innerHTML = "<li>Error loading podcast feed document</li>";
    },
    success: function(xmlText) {
      parseXML2(xmlText);
    }
  });
}

// run on page ready
$(function() {
  listEl = document.getElementById('episode-list');
  window.loadFeed();
});
