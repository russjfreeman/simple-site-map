'use strict';

//  https://www.sitemaps.org/protocol.html

const createSitemap = require("../index");

const sss = createSitemap( {
    saveToPath: "./",
    hostname: "example.com",
    pretty: true,
    limit: 50000,
} );


sss.add( [
    "https://example.com/one?thing=stuff&a=zzz",
    "https://example.com/two"
] );

sss.add( [
    {url: "https://example.com/url1/"},
    {url: "https://example.com/url2/"}
] );

for( let i = 0; i < 100; i++ ) {
    sss.add( "https://example.com/" + i)
}


sss.save();

console.log( "finished")