var distToBottom, data, dataObj;
var waitingForData = false;
var xhr = new XMLHttpRequest();
var contentContainer = document.getElementsByClassName("content-container")[0];
var loadingContainer = document.getElementsByClassName("loading-container")[0];

function getDistFromBottom() {
  var scrollPosition = window.pageYOffset;
  var windowSize = window.innerHeight;
  var bodyHeight = document.body.offsetHeight;

  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
}

xhr.onload = function() {
  if (xhr.status === 200) {
    waitingForData = false;
    data = xhr.responseText;
    dataObj = JSON.parse(data);

    dataObj.messages.forEach(function(post, index) {
      var date1 = new Date(post.updated);
      var date2 = new Date();
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
      var postElement = document.createElement("div");
      postElement.classList.add("card");

      var img = document.createElement("img");
      img.src = './'+post.author.photoUrl;
      img.classList.add("image");

      var author = document.createElement("div");
      author.appendChild(document.createTextNode(post.author.name));
      author.classList.add("author");

      var small = document.createElement("small");
      small.appendChild(document.createTextNode(diffDays + ' days ago'));
      small.classList.add("small");

      var desc = document.createElement("div");
      desc.innerHTML = post.content;
      desc.classList.add("content");


      postElement.appendChild(img);
      postElement.appendChild(author);
      postElement.appendChild(small);
      postElement.appendChild(desc);

      contentContainer.appendChild(postElement);
    });
  }
};

xhr.open(
  "GET",
  "https://message-list.appspot.com/messages",
  true
);
xhr.send();
waitingForData = true;

document.addEventListener("scroll", function() {
  distToBottom = getDistFromBottom();

  if (!waitingForData && distToBottom > 0 && distToBottom <= 1000) {
    waitingForData = true;
    loadingContainer.classList.add("no-content");

    xhr.open(
      "GET",
      "https://message-list.appspot.com/messages",
      true
    );
    xhr.send();
  }
});
