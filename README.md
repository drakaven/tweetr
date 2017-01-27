# Tweeter Project

A simple single-page AJAX-based Twitter clone that uses jQuery, HTML5 and plain ol' CSS3 to help web bootcamp students get comfortable with their front-end chops with those technologies.

## Technical Approach & Objectives

This project is starter (incomplete) code for students to fork and clone, located here.

The server is built with Node and Express and allows users to request and submit tweets via a JSON end-point. The server/express code should not require any change from the student.

Students must work with and implement the HTML, CSS and client-side JS to bring this project to life.

## Application Instructions
Stretch goals for login and tweet liking(kissing) have been completed.
 Register: enter a username and click register. Errors will be thrown on duplicate if mongodb is setup for unique index
 Login: use previously registered username, error will be thrown if not found

 Kiss: you can not kiss your own post, kisses are maintained across reload kisses in tweets.likes{}



## Final Product

The end result should look and function like this:

!["End Result"](https://d.pr/i/1eyEY/4MEH16BY+)

## Getting Started

1. Fork and clone your fork of this repository.
2. Install dependencies: `npm install` or `npm i` for short.
3. Start the web server from the command line: `npm run local`
4. Open the app on <http://localhost:8080/> and make sure that it's loading.

## Dependencies & Troubleshooting

Dependencies:

- Node 5.10.x or above
    "body-parser": "^1.15.2",
    "chance": "^1.0.2",
    "cookie-parser": "^1.4.3",
    "cookie-session": "^2.0.0-alpha.2",
    "cookieparser": "^0.1.0",
    "express": "^4.13.4",
    "md5": "^2.1.0",
    "mongodb": "^2.2.21"

**This project assumes that:**

- It is running in our Vagrant machine (and therefore...)
- It is Running with Node 5.10.x or above
- MongoDB running on 27017



