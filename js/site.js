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

  window.showDetails = (e) => {
    e.preventDefault();
    
  }

  function renderList(data) {
    var mustache = require('mustache');
    var xxx = [];
    
    const episodeList = data.rss.channel[0].item.map(episode => {
      console.warn(episode);
      
      const episodeNumber = episode.title[0].split(":")[0];
      // episode.example = true;
      episode.numEpisode = episodeNumber.replace("#","");
      episode.title = episode.title[0].replace(episodeNumber + ": ", "")
      return episode;
    });

    var template = "{{#.}}<li><span class='episode-num'>№{{numEpisode}}</span> <a onclick='showDetails(event)' href='episodes/{{numEpisode}}'>{{title}}</a></li>{{/.}}";
    var text = mustache.to_html(template, episodeList);
    console.log(episodeList);

    var list = document.getElementById('episode-list');
    list.insertAdjacentHTML('beforeend', text);
  }

  function parseXML2(data) {
    var parseString = require('xml2js').parseString;
    parseString(data, function (err, w) {
      renderList(w);
      window.w = w;
    });
  }
});


