const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const slugify = require('@sindresorhus/slugify');
const fs = require('fs-extra');
const path = require('path');

const { sleep } = require('../../../common/util');
const { formatFirstPhoneNumberInText } = require('../../../common/phone');
const { resolveUrl } = require('../../../common/url');
const { cleanUpRecord } = require('../../../common/records');

const PAGES = {
    'gandersheim-seesen': 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/gandersheim-seesen.html',
    'bad-harzburg': 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/bad-harzburg.html',
    braunschweig: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/braunschweig.html',
    goslar: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/goslar.html',
    helmstedt: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/helmstedt.html',
    koenigslutter: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/koenigslutter.html',
    'salzgitter-bad': 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/salzgitter-bad.html',
    'salzgitter-lebenstedt': 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/salzgitter-lebenstedt.html',
    schoeppenstedt: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/schoeppenstedt.html',
    vechelde: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/vechelde.html',
    vorsfelde: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/vorsfelde.html',
    wolfenbuettel: 'https://www.landeskirche-braunschweig.de/gemeinden/propsteien/wolfenbuettel.html',
};
const OUT_DIR_BASE = path.join(__dirname, 'out');

async function main() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        for (const [propstei, url] of Object.entries(PAGES)) {
            const out_dir = path.join(OUT_DIR_BASE, propstei);
            fs.ensureDirSync(out_dir);

            await page.goto(url);

            // The page loads the content we are interested in via AJAX after the page itself has been loaded.
            await sleep(5000);
            const html = await page.content();
            const $ = cheerio.load(html);
            const institutions = $('.institution-result');

            institutions.each(function () {
                const name = $('.institution-name', this).text();
                const address = (() => {
                    const e = $('.details-fields', this);
                    const c = e.contents();
                    return `${c
                        .slice(0, c.index(e.find('div').first()))
                        .get()
                        .map((el) => (el.data || '').trim().replace(/\s\s+/, ' '))
                        .filter((l) => l && !l.startsWith('gehört zu') && !l.startsWith('Bezirk'))
                        .join('\n')}\n${$('.address-zip-city', this).first().text()}\nDeutschland`;
                })();

                const record = cleanUpRecord({
                    slug: slugify(name),
                    name,
                    'relevant-countries': ['de'],
                    address,
                    phone: formatFirstPhoneNumberInText($('.address-phone', this).text(), 'de'),
                    fax: formatFirstPhoneNumberInText((fax = $('.address-fax', this).text()), 'de'),
                    email: ($("a[href^='mailto:']", this).attr('href') || '').replace(/^mailto:/, ''),
                    web: resolveUrl($("a[target='_blank']", this).attr('href'), url),
                    // The page defines a <base>, thus we have to prepend the URLs with '/' to get the correct absolute URL.
                    sources: [resolveUrl('/' + $('.institution-name a', this).attr('href'), url, ['cHash'])],
                    'custom-access-template': 'access-evangelische-kirche',
                    'custom-erasure-template': 'erasure-evangelische-kirche',
                    'custom-rectification-template': 'rectification-evangelische-kirche',
                    quality: 'scraped',
                    'facet-group': 'church',
                });

                fs.writeFileSync(path.join(out_dir, `${record.slug}.json`), JSON.stringify(record, null, 4) + '\n');
            });
        }

        await browser.close();
    } catch (err) {
        console.error(err);
        if (browser) await browser.close();
    }
}

main();
