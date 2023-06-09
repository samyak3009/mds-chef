const path = require('path');
const { writeFile } = require('fs-extra');
const puppeteerCore = require('puppeteer-core');
const generateImports = require('./generateImports');

const STORYBOOK_HOST = process.env.STORYBOOK_HOST || "http://mds.innovaccer.com/iframe.html?id=components-avatargroup-all--all&args=&viewMode=story"

const read = async (url) => {
    const browser = await usePuppeteerBrowser();
    const page = await browser.newPage();
    console.log('Loading storybook from: ', url);
    await page.goto(url).catch(console.log);
    await page.waitForFunction('window.__STORYBOOK_STORY_STORE__ && window.__STORYBOOK_STORY_STORE__.extract && window.__STORYBOOK_STORY_STORE__.extract()', { timeout: 60000 })
        .catch(console.log)
    const data = JSON.parse(await page.evaluate(async () => {
        const stories = __STORYBOOK_STORY_STORE__.extract();
        // eslint-disable-next-line no-undef
        return JSON.stringify(stories, null, 2);
    }).catch(console.log));
    setImmediate(() => {
        browser.close();
    });
    return data;
};
const useLocation = async (input) => {
    if (input.match(/^http/)) {
        return [input, async () => { }];
    }
};
const usePuppeteerBrowser = async () => {
    const args = ['--no-sandbox ', '--disable-setuid-sandbox'];
    try {
        return await puppeteerCore.launch({
            headless: true,
            args
        });
    }
    catch (e) {
        // it's not installed
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line global-require
            require('child_process').exec(`node ${require.resolve(path.join('puppeteer-core', 'install.js'))}`, (error) => (error ? reject(error) : resolve(puppeteerCore.launch({ args }))));
        });
    }
};

function convert(componentData) {
    const jsxCode = componentData && componentData.parameters
        ? componentData.parameters.docs.docPage?.customCode ||
        componentData.parameters.storySource?.source
        : '';

    const { title } = componentData.parameters.docs.docPage || {};
    const storyTitle = componentData.title.replace(/\//g, ' ').replace('Variants', ' ').replace('Components', ' ').trim();
    const name = title || storyTitle;

    const importString = generateImports(jsxCode, undefined, '@innovaccer/design-system');

    const jsx = `${importString}
    ${jsxCode}
    `

    if(!name) {

        console.log(name, componentData.title);
    }

    return {
    // {
        // [name.split(' ')[0].toLowerCase()]: 
            query: name,
            // description: componentData.story,
            code: jsx
        }
    // }


}

async function extract(input, targetPath) {
    if (input && targetPath) {
        const [location, exit] = await useLocation(input);
        const data = await read(location);
        console.log('Writing data to: ', targetPath);

        const complete = Object.keys(data).reduce((out, key) => {
            const componentStory = data[key];
            const {title} = componentStory;
            const name = title.split('/')[1].toLowerCase();
            const snippet = convert(data[key]);
            if(!out[name]) {
                out[name] = []
            }
            if(snippet.code.length < 3100)
            out[name].push(snippet)
            return out;
        }, {})

        await writeFile(targetPath, JSON.stringify(complete, null, 2));

        await exit();
    }
    else {
        throw new Error('Extract: please specify a path where your built-storybook is (can be a public url) and a target directory');
    }
}

extract(STORYBOOK_HOST, path.join(__dirname, './stories.json'))
