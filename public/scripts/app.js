$(document).ready(function () {

  // use delegate
  /*
  $('#tweetContainer').on('mouseenter', 'article' ,function(event){
    event.stopPropagation();
    let element = $(this).find('img');
    let pathSrc = element[0].src.replace("_50.png", "_100.png");
    element.attr('src' , pathSrc);
    console.log(pathSrc);
    }).on('mouseout', 'article' ,function(event) {let adjustHeight = Math.floor($(this).height() * 1.2);
    let element = $(this).find('img');
    let pathSrc = element[0].src.replace("_100.png", "_50.png");
    element.attr('src' , pathSrc);
  });
//
*/
  $.ajaxSetup({
    beforeSend: function() {
      $('#loader').show();
    },
    complete: function(){
      $('#loader').hide();
    }
  });



  const createTweetElement = function (tweetObject) {
    let daysAgo = Math.floor((Date.now() - tweetObject.created_at) / 86400000);
    (!daysAgo) ? daysAgo = "Posted: Today!" : daysAgo = `Posted: ${daysAgo} days ago` ;
    let newArticle = $('<article class="tweet"></article>');
    newArticle[0].innerHTML = `<header>
      <img class="tweeterAvatar" src=${tweetObject.user.avatars.small}>
      <h3 class="tweeterName">${tweetObject.user.name}</h3>
      <p class="tweeterId">${tweetObject.user.handle}</p>
      </header>
      <p class="tweetText">${tweetObject.content.text}</p>
      <footer>
      <p class="postedDate">${daysAgo}</p>
      </footer>`;
    return newArticle[0];
  };

  const renderTweets = function (tweetData) {
    let tweetContainer = $('#tweetContainer');
    for (tweet in tweetData) {
      tweetContainer.append(createTweetElement(tweetData[tweet]));
    }
  };

  const loadTweets = function () {
    $.get("/tweets", function (data, status) {
      $('#tweetContainer')[0].innerHTML = null;
      renderTweets(data);
    });
  };

  loadTweets();


  $('#form1').on('submit', function (event) {
    event.preventDefault();
    let newData = $(this).serialize();
    $.post("/tweets",
      newData).done(function () {
      console.log("done");
      loadTweets();
    });


  });
//document ready close tag
});
