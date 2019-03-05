'use strict';

const fs = require("fs");

const maxSitemapSizeBytes = 50 * 1024 * 1024;
const maxURLsPerFile = 50000;

const today = new Date();

class SimpleSiteMap {
    constructor(options) {
        this.content = [];
        this.files = [];

        this.options = {
            path: "/",
            limit: 100,
            pretty: false,
            hostname: "",
            priority: 0.5,
            changeFrequency: "weekly"
        };

        this.setOptions(options);

        this.index = `<?xml version='1.0' encoding='UTF-8'?><sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>`
        this.siteMapIndexID = 0;
    }

    setOptions(options) {
        this.options = Object.assign(this.options, options);
        if (this.options.hostname.length == 0) {
            throw "need to add a hostname e.g. hostname='example.com'";
        }

        if (this.options.limit > maxURLsPerFile) {
            throw `Can't add more than ${maxURLsPerFile} URLs to a file`;
        }
    }

    // Accepts: an item or an array of items
    //  Items can be strings or objects like {url, dt, priority, changeFrequency}
    add(item) {
        if (Array.isArray(item)) {
            item.forEach(i => {
                this.addURL(i)
            })
        } else {
            this.addURL(item)
        }
    }

    addURL(url) {
        if (typeof url === 'string' || url instanceof String) {
            this.content.push(new smURL(url));
        } else {
            this.content.push(new smURL(url.url, url.dt, url.priority, url.changeFrequency));
        }
    }

    save() {
        const limit = this.options.limit;
        const changeFrequency = this.options.changeFrequency;
        const priority = this.options.priority;


        function getItem(item) {
            return `<url><loc>${item.url}</loc><lastmod>${getDate( item.dt )}</lastmod><changefreq>${either(item.changeFrequency, changeFrequency )}</changefreq><priority>${either(item.priority, priority)}</priority></url>`
        }

        function getItemPretty(item) {
            //  No doubt about it; This is ugly but it works, and nicer than \r\n\t etc.
            return `
<url>
    <loc>${ item.url}</loc>
    <lastmod>${getDate( item.dt )}</lastmod>
    <changefreq>${either(item.changeFrequency, changeFrequency )}</changefreq>
    <priority>${either(item.priority, priority)}</priority>
</url>`
        }

        const makeItem = this.options.pretty ? getItemPretty : getItem;

        let sm = "";
        this.content.forEach((item, index) => {
            if ( (index > 0 && index % limit == 0) || sm.length > maxSitemapSizeBytes) {
                this.writeSitemapFile(sm);
                sm = "";
            }
            sm += makeItem(item);
        });

        if( sm.length){
            this.writeSitemapFile(sm);
        }
        this.index += "</sitemapindex>";

        const indexFilename = "sitemap.xml";

        fs.writeFileSync( this.options.saveToPath + indexFilename, this.index);
        this.files.push( indexFilename );
        return this.files;
    }

    writeSitemapFile(content) {
        const sitemapHeader = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        const sitemapFooter = "</urlset>"

        const dtNow = new Date();
        const date = getDate(dtNow);
        const filename = "sitemap-" + this.siteMapIndexID + ".xml";
        this.index += `<sitemap><loc>https://${this.options.hostname + this.options.path + filename}</loc><lastmod>${date}</lastmod></sitemap>`
        fs.writeFileSync( this.options.saveToPath + filename, sitemapHeader + content + sitemapFooter);
        this.siteMapIndexID++;
        this.files.push( filename );
    }
}

class smURL {
    constructor(url, dt, priority, changeFrequency) {
        this.url = encodeURL( url );
        this.dt = dt;
        this.priority = priority;
        this.changeFrequency = changeFrequency;
    }
}

function encodeURL( srcURL ) {
    //  This needs a lot of love BUT I don't want to require anything else
    //  So we can kind of fudge it. Anyone have a more complete solution?
    //  
    const urlBits = srcURL.split( "?" );
    if( urlBits.length > 1){
        return encodeURI( urlBits[0] ) + "?" + replaceAll( urlBits[1], "&", "&amp;" );
    } else{
        return encodeURI( srcURL );
    }
}



function createSitemap(opts) {
    return new SimpleSiteMap(opts);
}

function pad(s) {
    return s.toString().padStart(2, "0");
}

function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
};

function either(thisOne, thatOne) {
    return thisOne ? thisOne : thatOne;
}

function getDate(dt) {
    //2004-12-23T18:00:15+00:00 
    if (dt) {
        return dt.getFullYear() + "-" + pad((dt.getMonth() + 1)) + "-" + pad(dt.getDate()) + "T" + pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + "+00:00";
    } else {
        return getDate(today);
    }
}


module.exports = createSitemap;