var request = require('request');
var cheerio = require('cheerio');

var links = []; // links with this domain
var externalLinks = []; // links to external sites
var staticContent = []; // links to static content
var host = "";
var level = 0;

//determine if the page is internal  
function IsInternal(url)
{
  try
  {
    if(!url.startsWith("#"))
    {
      // ignore simple anchor since it's just somewhere in on this page
      var myURL = new URL(url);
      if(host == myURL.host)
        return true;
    }
  }
  catch(exception)
  {
    // log and handle exceptions
  }
  return false;
}

// if the array doesn't already contain this link then add it otherwise do nothing.
function AddIfUnique(arr, link)
{
  var found = arr.find(function(element) { 
    return element == link; 
  }); 

  if(!found)
  {
    arr.push(link);
  }
}

// check to see if we've already visited this url
function IsNotYetVisited(url)
{
  var found = links.find(function(element) { 
    return element == url; 
  }); 

  return !found;
}

// display the results
function DisplayResults()
{
  console.log("====================== links ======================");
  links.forEach(element => {
    console.log(element);  
  });
  console.log("====================== external links ======================");
  externalLinks.forEach(element => {
    console.log(element);  
  });
  console.log("====================== static content ======================");
  staticContent.forEach(element => {
    console.log(element);  
  });
}
function Init(url)
{
    // initialize the host
    var myURL = new URL(url);
    host = myURL.host;
}

function scan(url)
{
  if(host == ""){
    // initialize the host
    Init(url);
  }

  console.log("processing.....[" + url + "]");

  level = level + 1; // increment this since we're processing a page
  request(url, 
    function(error, response, html)
    {
      try{
        if(!error){
            links.push(url);// add the root to the links we've visited since we're processing this page now.
            var $ = cheerio.load(html);

            // look for image links
            $('img[src]').each( (index, value) => {
              var src = $(value).attr('src');
              if(src.match("\.(jpg|png|gif|mp4|jpeg)$"))
                AddIfUnique(staticContent, src);
            });

            // find all anchors with hrefs
            $('a[href]').each( (index, value) => {
              var link = $(value).attr('href'); // get href
              if(IsInternal(link))
              {
                // if it's internal then check if we've already visited it
                if(IsNotYetVisited(link))
                {
                  // we haven't visited it so process it
                  links.push(link); // add it to the unique links list
                  scan(link);
                }
              }
              else if(!link.startsWith("#"))
                AddIfUnique(externalLinks, link);
                
            });
        }
      }
      finally
      {
        level  = level -1; //decrement counter for processed links

        if(level == 0)
        {
          // we are done crawling so display the results.
          DisplayResults();
        }
      }
    }
  )
}

module.exports.links = links;
module.exports.IsInternal = IsInternal;
module.exports.host = host;
module.exports.Init = Init;
module.exports.IsNotYetVisited = IsNotYetVisited;
module.exports.AddIfUnique = AddIfUnique;

// create exported entry point 
module.exports.crawl = function (url) { 
  console.log("scanning...");
  scan(url);
 };
