$(document).ready(function () {

  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  $.ajaxSetup({
    beforeSend: function() {
      $('#loader').show();
      $('#tweetContainer')[0].innerHTML = null;
    },
    complete: function(){

      $('#loader').hide();

    }
  });

  $('#compose').on('click', function(){
    console.log("clicked");
    $('.new-tweet').slideToggle(100);
    $('.new-tweet').find('textarea').focus();
  })



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
      <img class="kiss" src="/images/kiss-lips-icon.png">
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
    let escaped = escape($(this).children('textarea')[0].value);
    let flashMess = $(this).children('.flashMessage')[0];
    if (!escaped || escaped.length > 140) {
      $(this).parent().css('border', '2px solid red');
      flashMess.innerHTML = 'Tweets must be between 1 and 140 characters!';
      return;
    } else {
      $(this).parent().css('border', 'none');
      flashMess.innerHTML  = "";
    }
    $.post("/tweets"
      , "text=" + escaped
      ).done(function () {
      console.log("done");
      loadTweets();
    });


  });
//document ready close tag
});
