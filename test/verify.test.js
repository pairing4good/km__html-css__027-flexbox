const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the value 200px', () => {
    it('should be contained in a variable named wide-text-size', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/--wide-text-size.*:.*200px/g).length;
      });
      
      expect(variableDefinitionCount).toEqual(1);
        
      const variableUsageCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/var.*\(.*--wide-text-size.*\)/g).length;
      });
        
      expect(variableUsageCount).toEqual(1);
    });
});

describe('the value 150px', () => {
    it('should be contained in a variable named narrow-text-size', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/--narrow-text-size.*:.*150px/g).length;
      });
        
      expect(variableDefinitionCount).toEqual(1);
        
      const variableUsageCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/var.*\(.*--narrow-text-size.*\)/g).length;
      });
        
      expect(variableUsageCount).toEqual(1);
    });
});

describe('the variable narrow-text-size', () => {
    it('should be overridden for the narrow-text class definition with the value 120px', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/--narrow-text-size.*:.*120px/g).length;
      });
        
      expect(variableDefinitionCount).toEqual(1);
    });
});

describe('the value 10px', () => {
    it('should be contained in a variable named text-padding', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/--text-padding.*:.*10px/g).length;
      });

      expect(variableDefinitionCount).toEqual(1);
        
      const variableUsageCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/var.*\(.*--text-padding.*\)/g).length;
      });
        
      expect(variableUsageCount).toEqual(2);
    });
});

describe('the wide-text-size variable', () => {
    it('should be set to 180px when the screen is 150px wide or less', async () => {
      const variableDefinitionCount = await page.$eval('style', (style) => {
        return style.innerHTML.match(/@media.*\(.*max-width.*:.*150px.*\).*{[\s\S][^}]*--wide-text-size.*:.*180px;/g).length;
      });
        
      expect(variableDefinitionCount).toEqual(1);
    });
});
