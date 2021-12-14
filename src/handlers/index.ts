import { Handler } from 'aws-lambda';
import chromium from 'chrome-aws-lambda';

export const handler: Handler<HandlerRequest, HandlerResponse> = async (_event, _context): Promise<HandlerResponse> => {
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://www.dmm.co.jp/search/=/searchstr=JUL-708');
        await page.screenshot({ path: 'example00.png' });
        const selector = '#list .tmb a:nth-child(1)';
        await page.waitForSelector(selector);
        await page.click(selector);

        const url = page.url();
        console.log(url);
        if (url.startsWith('https://www.dmm.co.jp/age_check/')) {
            await page.waitForSelector('.ageCheck__btn');
            const btns = await page.$$('.ageCheck__btn');

            for (const btn of btns) {
                const text = await page.evaluate((el) => el.innerText, btn);
                if (text === 'はい') {
                    await btn.click();
                    break;
                }
            }
        }
        await page.waitForSelector('#sample-video');
        await page.screenshot({ path: 'example11.png' });

        const data = await page.evaluate(() => {
            const data = {};
            const element = document.querySelector('#sample-video img');
            data['tumbImgUrl'] = element['src'];
            data['fullImgUrl'] = data['tumbImgUrl'].replace('ps.jpg', 'pl.jpg');
            data['title'] = document.querySelector('#title').textContent;
            const imgs = document.querySelectorAll('a[name=sample-image] img');
            data['screenImgUrls'] = Array.from(imgs).map((x) => x['src']);

            const pageDetail = document.querySelector('.page-detail');
            const tl = pageDetail.querySelector('table').querySelector('table').querySelectorAll('tr');
            for (const tr of tl) {
                const tds = tr.querySelectorAll('td');
                if (tds.length == 0) continue;

                if (tds[0].textContent === '商品発売日：') {
                    const ss = tds[1].textContent;
                    data['releaseDate'] = ss.trim();
                }
                if (tds[0].textContent === '出演者：') {
                    const ss = tds[1].textContent;
                    data['actress'] = ss.trim().split('\n');
                }
                if (tds[0].textContent === 'シリーズ：') {
                    let ss = tds[1].textContent;
                    if (ss === '----') ss = '';
                    data['series'] = ss.trim();
                }
                if (tds[0].textContent === 'メーカー：') {
                    let ss = tds[1].textContent;
                    if (ss === '----') ss = '';
                    data['manufacturer'] = ss.trim();
                }
                if (tds[0].textContent === 'レーベル：') {
                    let ss = tds[1].textContent;
                    if (ss === '----') ss = '';
                    data['label'] = ss.trim();
                }
                if (tds[0].textContent === 'ジャンル：') {
                    const ss = tds[1].querySelectorAll('a');
                    const ll = [];
                    ss.forEach((x) => ll.push(x.text));
                    data['tags'] = ll;
                }
            }
            return data;
        });

        return data;
    } finally {
        await browser.close();
    }
};

type HandlerRequest = {
    some?: string;
};

type HandlerResponse = {
    some?: string;
};
