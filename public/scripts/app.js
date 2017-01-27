const loggedUser = document.cookie.replace("loginID=", "") || null;

$(document).ready(function () {

  $(".loggerUserName").text(loggedUser);
  if (loggedUser) {
    $(".loginBlock").hide()
  } else {
    $(".logoutBlock").hide()
  };


  $('#tweetContainer').delegate('.kiss', 'click', function (ev) {
    ev.stopPropagation();
    $(this).toggleClass('kissed');
    let kisses = Number($(this).next().text());
    if ($(this).hasClass('kissed')) {
      kisses++;
      $(this).next().text(kisses);
    } else {
      kisses--;
      $(this).next().text(kisses);
    }
    let tweetId = $(this).closest("article");
    let tempScrollTop = $(window).scrollTop();
    $.post("tweets/kiss", "tweetId=" + tweetId[0].dataset.id).complete(
      function () {
        $(window).scrollTop(tempScrollTop)
      })
  });

  //show compose button and new tweet box if logged in
  if (document.cookie) {
    $('.hidden').show();
  }

  //function to make input html safe
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  $('#compose').on('click', function () {
    console.log("clicked");
    $('.new-tweet').slideToggle(100);
    $('.new-tweet').find('textarea').focus();
  });


  const createTweetElement = function (tweetObject) {
    let daysAgo = Math.floor((Date.now() - tweetObject.created_at) / 86400000);
    (!daysAgo) ? daysAgo = "Posted: Today!" : daysAgo = `Posted: ${daysAgo} days ago`;
    let hidden = "";
    let kissed = "";
    if (loggedUser === tweetObject.author || loggedUser === null) {
      hidden = "hidden"
    }
    if (tweetObject.likes.hasOwnProperty(loggedUser)) {
      kissed = "kissed";
    }


    let newArticle = $('<article class="tweet"></article>');
    newArticle[0].dataset.id = tweetObject._id;
    newArticle[0].dataset.author = tweetObject.author;
    newArticle[0].innerHTML = `<header>
      <img class="tweeterAvatar" src=${tweetObject.user.avatars.small}>
      <h3 class="tweeterName">${tweetObject.user.name}</h3>
      <p class="tweeterId">${tweetObject.user.handle}</p>
      </header>
      <p class="tweetText">${tweetObject.content.text}</p>
      <footer>
      <p class="postedDate">${daysAgo}</p>
      <img class="kiss ${hidden} ${kissed}"  src="/images/kiss-lips-icon.png">
      <span class="kisses">${Object.keys(tweetObject.likes).length}</span>
      </footer>`
    return newArticle[0];
  };

  const renderTweets = function (tweetData) {
    let tweetContainer = $('#tweetContainer');
    for (tweet in tweetData) {
      tweetContainer.append(createTweetElement(tweetData[tweet]));
    }

    $('#loader').hide();
    $('#tweetContainer').show();
  };

  const loadTweets = function () {
    $.get("/tweets", function (data, status) {
        $('#tweetContainer')[0].innerHTML = null;
        $('#loader').show();
        $('#tweetContainer').hide();
        renderTweets(data);
      }
    )
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
      flashMess.innerHTML = "";
    }
    $.post("/tweets"
      , "text=" + escaped
    ).done(function () {
      loadTweets();
    });
  });

//document ready close tag
});
