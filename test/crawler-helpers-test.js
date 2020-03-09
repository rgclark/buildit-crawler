/* test/sitesVisited.js */
var crawler = require('../src/crawler.js');
var expect = require('chai').expect;

describe('#web crawler internal functions tests', function() {
  
  beforeEach(function() {
    crawler.links = [];
  })

  context('AddIfUnique', function() {
    it('should add to empty', function() {
      expect(crawler.links.length).to.equal(0);
        crawler.AddIfUnique(crawler.links, "http://test.com");
        expect(crawler.links.length).to.equal(1);
        expect(crawler.links[0]).to.equal("http://test.com");
    })

    it('should not add if duplicate', function() {
        crawler.links.push("http://test.com");
        expect(crawler.links.length).to.equal(1); //seeded
        expect(crawler.links[0]).to.equal("http://test.com");
        crawler.AddIfUnique(crawler.links, "http://test.com");
        expect(crawler.links.length).to.equal(1);
    })
  })

   context('IsInternal', function() {
    it('is internal if the domain is the same', function() {
        crawler.Init("http://wiprodigital.com");
        expect(crawler.IsInternal("http://wiprodigital.com")).to.equal(true);
        expect(crawler.IsInternal("https://wiprodigital.com")).to.equal(true);
      })
      it('is not internal if the domain is different', function() {
        crawler.Init("http://wiprodigital.com");
        expect(crawler.IsInternal("http://google.com")).to.equal(false);
      })

   })
})