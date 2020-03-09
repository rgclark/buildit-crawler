Simple web crawler written in javascript node.

I build the web crawler using javascript in node. I used cheerio for the html parsing. I gather the links on the root page and traversed the links. If the link is external, then it's stored. If the link is in the host domain, then it is stored and the link is crawled. The visited links are stored so that they can be skipped in the future if it's encountered again. I left in links with parameters as that could expose unseen links. 

To build, from the command line of the root project directory run:
```
npm install
```

To run, from the root directory run:
```
node -p "require('./src/crawler.js').crawl('http://wiprodigital.com')"
```
To run the test from the root directory run:

```
npm test
```

If I had more time, I would have:
 - added a mock to feed the crawler requests with test html. 
 - made the storage arrays and the variable used to track if we're proccessing files threadsafe
 - culled out links that differ only by anchor(#) 
 - added a web front end to enter url and display the results


