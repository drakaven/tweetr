$(document).ready(function (tweetObj) {

  const createTweetElement = function (tweetObject) {
    let newArticle = $('<article id="tweet1" class="tweet"></article>');
    newArticle[0].innerHTML = `<header>
      <img id="tweeterAvatar" href=${tweetObject.user.avatars.small}>
      <span id="tweeterName">${tweetObject.user.name}</span>
      <span id="tweeterId">${tweetObject.user.handle}</span>
      </header>
      <p class="tweetText">${tweetObject.content.text}</p>
      <footer>
      <span class="postedDate">${tweetObject.created_at}</span>
      </footer>`;
    return newArticle[0];
  };

  const renderTweets = function (tweetData) {
    let tweetContainer = $('#tweetContainer');
    for (tweet in tweetData) {
      tweetContainer.append(createTweetElement(tweetData[tweet]));
    }
  };
  //cannot use self executing
  const loadTweets = function () {
    $.get("/tweets", function (data, status) {
      $('#tweetContainer')[0].innerHTML = null;
      renderTweets(data);
    });
  };

  loadTweets();

  console.log(loadTweets);
  $('#form1').on('submit', function (event) {
    event.preventDefault();
    let newData = $(this).serialize();
    $.post("/tweets",
      newData,
      loadTweets())
  });
//document ready close tag
});
