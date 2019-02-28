window.app = window.app || {};

// getElementById wrapper
function $id(id) {
  return document.getElementById(id);
}

// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTMLintoId(url, id) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  req.onload = () => {
    $id(id).innerHTML = req.responseText;
  };
}

// use #! to hash
router = new Navigo(null, true, '#');
// 'view' is the id of the div element inside which we render the HTML
router.on(
  'episode', () => { loadHTMLintoId('./templates/episode.html', 'view'); },
  {
    after: () => {
      // window.loadFeed();
      console.log('episode loaded');
    }
  }
);

router.on(
  '/:id', (params) => {
    loadHTMLintoId('./templates/episode.html', 'view');
  },
  {
    after: (params) => {
      window.loadFeed();
      setTimeout(function(){ 
        showEpisodeInfo(window.episodeList, {showEpisodeNum: params.id});
      }, 1000);
      console.log(params.id, ' episode loaded');
    }
  }
);
// router.on({
//   '/:id': (params) => {
//     console.log(params.id);
//   }
// });


// set the default route
router.on(() => { loadHTMLintoId('./templates/home.html', 'view'); },
  {
    after: () => {
      window.loadFeed();
      console.log('home loaded');
    }
  }
);

// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

router.resolve();
