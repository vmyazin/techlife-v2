$(function() {
  var xmlText;

  $.ajax({
    url: 'http://techlifepodcast.com/podcast-feed.xml',
    type: 'GET',
    dataType: 'text',
    timeout: 1000,
    error: function(){
      alert('Error loading XML document');
    },
    success: function(xmlText) {
      // console.log(xmlText);
      parseXML(xmlText);
    }
  });


  // $.get('http://techlifepodcast.com/podcast-feed.xml', function(data) {
  //   xmlText = data;
  // }).done(function() {
  //   console.log(xmlText);
  //   parseXML(xmlText);
  // });  

  function parseXML(file) {
    var XMLParser = require('react-xml-parser');
    var xml = new XMLParser().parseFromString(file);
    console.log(xml);
    console.log(xml.getElementsByTagName('item'));
  }
});


