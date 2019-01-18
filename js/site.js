$(function() {

  var xmlText,
      jsonEpisodeList;

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

  function renderList(data) {
    let mustache = require('mustache');
    let moment = require('moment');
    require('moment/locale/ru');
    
    const episodeList = data.rss.channel[0].item.map(episode => {
      const episodeNumber = episode.title[0].split(":")[0];
      episode.episodeNum = episodeNumber.replace("#",""); // get clean episode number
      episode.title = episode.title[0].replace(episodeNumber + ": ", ""); // get clean episode title
      episode.pubDateConverted = moment(episode.pubDate[0]).locale('ru').format("LL"); // get neat episode date in Russian
      return episode;
    });

    window.showDetails = (e, num) => {
      e.preventDefault();

      num = num + ''; // update var JS type
  
      var result = episodeList.find(obj => {
        return obj.episodeNum === num; // get item with the given episode number
      });

      var template = '<div class="selected-box"><h3><span class="episode-num">№{{episodeNum}}</span> <a href="episodes/{{episodeNum}}">{{title}}</a> <span class="small-caps date">{{pubDateConverted}}</span></h3>{{{description.0}}}</div>';
      var tplOutput = mustache.to_html(template, result);
  
      let currentLi = document.getElementsByClassName('episode-' + num)[0];
      currentLi.classList.add('selected');
      currentLi.innerHTML = tplOutput;
      console.log(currentLi);
    }

    var template = "{{#.}}<li class='episode-{{episodeNum}}'><span class='episode-num'>№{{episodeNum}}</span> <a onclick='showDetails(event, {{episodeNum}})' href='episodes/{{episodeNum}}'>{{title}}</a></li>{{/.}}";
    var tplOutput = mustache.to_html(template, episodeList);
    console.log(episodeList);

    var list = document.getElementById('episode-list');
    list.insertAdjacentHTML('beforeend', tplOutput);

    // select the lastest episode on load
    let latestEpisodeNum = episodeList[0].episodeNum;
    showDetails(event, latestEpisodeNum);
  }

  function parseXML2(data) {
    var parseString = require('xml2js').parseString;
    parseString(data, function (err, w) {
      renderList(w);
      window.w = w;
    });
  }
});


