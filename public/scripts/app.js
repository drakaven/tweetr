const loggedUser = document.cookie.replace("loginID=", "") || null;
//html safe escape function
const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$(document).ready(function () {

  //toggle login blocks visibility
  $(".loggerUserName").text(loggedUser);
  if (loggedUser) {
    $(".loginBlock").hide();
    $('.hidden').show();
  } else {
    $(".logoutBlock").hide()
  }
  ;

  //delegate listener for kiss clicks
  $('#tweetContainer').delegate('.kiss', 'click', function (ev) {
    ev.stopPropagation();
    $(this).toggleClass('kissed');
    let kisses = Number($(this).prev(".kisses").text());
    if ($(this).hasClass('kissed')) {
      kisses++;
      $(this).prev(".kisses").text(kisses);
    } else {
      kisses--;
      $(this).prev(".kisses").text(kisses);
    }
    let tweetId = $(this).closest("article");
    //maintain screen postion after post
    let tempScrollTop = $(window).scrollTop();
    //update the likes array to add or remove user
    $.post("tweets/kiss", "tweetId=" + tweetId[0].dataset.id).complete(
      function () {
        $(window).scrollTop(tempScrollTop)
      })
  });

  //show tweet textarea on click of compose button
  $('#compose').on('click', function () {
    $('.new-tweet').slideToggle(100);
    $('.new-tweet').find('textarea').focus();
  });

  //generate the tweet html from mongo entry
  const createTweetElement = function (tweetObject) {
    let daysAgo = Math.floor((Date.now() - tweetObject.created_at) / 86400000);
    (!daysAgo) ? daysAgo = "Posted: Today!" : daysAgo = `Posted: ${daysAgo} days ago`;
    let hidden = "";
    let kissed = "";
    //If i am the author hide the like options
    if (loggedUser === tweetObject.author || loggedUser === null) {
      hidden = "hidden"
    }
    // If i liked am in the likes collection show the correct image
    if (tweetObject.likes.hasOwnProperty(loggedUser)) {
      kissed = "kissed";
    }
    //generate html
    let newArticle = $('<article class="tweet"></article>');
    newArticle[0].dataset.id = tweetObject._id;
    newArticle[0].dataset.author = tweetObject.author;
    newArticle[0].innerHTML = `<header>
      <img class="tweeterAvatar" src=${tweetObject.user.avatars.small}>
      <h3 class="tweeterName">${escape(tweetObject.user.name)}</h3>
      <p class="tweeterId">${escape(tweetObject.user.handle)}</p>
      </header>
      <p class="tweetText">${escape(tweetObject.content.text)}</p>
      <footer>
      <p class="postedDate">${daysAgo}</p>
      <div class="kissBlock">      
      <span>Kiss</span>
      <span class="kisses">${Object.keys(tweetObject.likes).length}</span>
      <img class="kiss ${hidden} ${kissed}"  src="/images/kiss-lips-icon.png">
      </div>
      </footer>`
    return newArticle[0];
  };

  //loop through returned tweets and call create on each and append to container
  const renderTweets = function (tweetData) {
    $('#tweetContainer')[0].innerHTML = null;
    let tweetContainer = $('#tweetContainer');
    for (tweet in tweetData) {
      tweetContainer.append(createTweetElement(tweetData[tweet]));
    }
    $('#loader').hide();
    $('#tweetContainer').show();
  };

  //get tweets from db show the load spinner
  const loadTweets = function () {
    $.get("/tweets", function (data, status) {
        $('#loader').show();
        $('#tweetContainer').hide();
        renderTweets(data);
      }
    )
  };

  //call on inital page load
  loadTweets();


  $('#form1').on('submit', function (event) {
    event.preventDefault();
    let flashMess = $(this).children('.flashMessage')[0];
    if ($(this).children('textarea')[0].value.length > 140) {
      $(this).parent().css('border', '2px solid red');
      flashMess.innerHTML = 'Tweets must be between 1 and 140 characters!';
      return;
    } else {
      $(this).parent().css('border', 'none');
      flashMess.innerHTML = "";
    }
    $.post("/tweets"
      , "text=" + $(this).children('textarea')[0].value
    ).done(function () {
      loadTweets();
    });
  });

//document ready close tag
});
