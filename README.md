# How is the World Feeling Today?

![app preview](https://i.imgur.com/W5MqIQ1.png)

## Inspiration
We wanted to make a news app that made it easy to view relevant information about articles and making it accessible to people of all ages.

## What it does
The web app lists the top trending topics of the world and allows the user to pick a specific region in the world. They can then view the overall sentiment of these articles and the main entities that are associated to these articles. 

## How we built it
By using the Taboola Trends API and Google Natural Language processing, we extracted the articles from the top list and ran it through the language processing API in order to get the different fields such as sentiment (general emotion), entities (keywords), and salience (relevance in the article). For the actual web app, we used node.js to display these results to a localhost. 

## Challenges we ran into
We had issues with the timing of async methods in node.js since these functions had a different order of execution than regular functions. We also ran into a couple issues with getting the Google GCP up and running with node.js in Linux. 

## Accomplishments that we're proud of
Getting the API's connected to each other and using the data of the natural language API.

## What we learned
Backend for servers and using node.js to create these and communicating between different API's. We also learned web UI/UX through the formatting of the webpage and making it interactive.

## What's Next for LAHacks
The next step in this project is to apply this concept to investing so that it will notify and predict whether stocks will go up or down based on the sentiment of an article or news. This will work bases on the entities in the article and how much salience they have. It will allow users to be aware of how their portfolio is doing. 
