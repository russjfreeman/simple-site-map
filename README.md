<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [simple-site-map][1]
-   [Typical usage][2]
-   [options][3]
    -   [Properties][4]
-   [url][5]
    -   [Properties][6]
-   [constructor][7]
    -   [Parameters][8]
-   [add][9]
    -   [Parameters][10]
-   [addURL][11]
    -   [Parameters][12]
-   [save][13]

## simple-site-map

Simple little module with no external dependencies that generates sitemap XML files.

-   Validate your sitemap: [https://webmaster.yandex.com/tools/sitemap/][14]
-   Read about the protocol: [https://www.sitemaps.org/protocol.html][15]

## Typical usage

```Javascript
const createSitemap = require("simple-site-map");

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

for( let i = 0; i < 500000; i++ ) {
sss.add( "https://example.com/" + i)
}



const files = sss.save();

console.log( "Written the following files...")
files.forEach( file => {
console.log( "\t" + file );
})

console.log( "finished")
```

## options

The options object

Type: [Object][16]

### Properties

-   `saveToPath` **[string][17]** Where to save the files. Default './'
-   `limit` **[number][18]** How many URLs per file. Max, and default: 50000
-   `pretty` **[boolean][19]** Whether to save the files in a pretty way (with whitespace)
-   `hostname` **[string][17]** The domain of your website
-   `priority` **[number][18]** Default priority to use. Default: 0.5
-   `changeFrequency` **[string][17]** Default change frequency to use. Default: "weekly"

## url

The url object

Type: [Object][16]

### Properties

-   `url` **[string][17]** the url of the link you are adding
-   `dt` **[date][20]** date/time the url was updated
-   `priority` **[number][18]** Default: 0.5
-   `changeFrequency` **[string][17]** Default: "weekly"

## constructor

The SimpleSiteMap object

### Parameters

-   `options` **[options][21]** 

## add

Add an item to the sitemap

### Parameters

-   `item`  
-   `Array` **item** of objects, single object, a URL, or an array of URLs

## addURL

Add an item to the sitemap

### Parameters

-   `url`  
-   `A` **[url][22]** single object, or a URL

## save

Save your sitemap XML files

Returns **[Array][23]** An array of filenames

[1]: #simple-site-map

[2]: #typical-usage

[3]: #options

[4]: #properties

[5]: #url

[6]: #properties-1

[7]: #constructor

[8]: #parameters

[9]: #add

[10]: #parameters-1

[11]: #addurl

[12]: #parameters-2

[13]: #save

[14]: https://webmaster.yandex.com/tools/sitemap/

[15]: https://www.sitemaps.org/protocol.html

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[18]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[21]: #options

[22]: #url

[23]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
