This will be converted into a swift script that takes a GPX route with LAT / LONG coordinate points for https://github.com/rolandpeelen/adv-dash.

Basically, it takes a bunch of coordinates that make up a route, draws a line between the points and then draws bouding boxes around those lines dividing them if they go over a certain length (linelength * 2 === surface * 4). This to reduce the amount of offline downloads for a route.
