const puppeteer = require("puppeteer");
const pug = require("pug");
const fs = require("fs").promises;

const MAX_SIMULTANEOUS_RENDERS = 10;

class PdfService {
  constructor() {
    this.config = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-translate",
        "--disable-extensions",
        "--disable-sync",
      ],
    };

    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    this.browser = await puppeteer.launch(this.config);
    this.initialized = true;
  }

  async generateScoresheet(template, allData, preview, delay) {
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }
    const timerMetric = Date.now();

    if (!this.initialized) {
      await this.browser;
    }

    // // Uncomment to test progress bars / loading / etc. in dev environment
    // await new Promise(r => setTimeout(r, 5000*Math.random()))

    // Backward compatibility - if we pass in an object, convert it to an array
    if (!allData.length) {
      allData = [allData];
    }

    const scoresheetHtmlPromises = [];

    allData.forEach((data) => {
      scoresheetHtmlPromises.push(
        Promise.all(
          Object.values(data.images).map((image_path) =>
            fs.readFile(image_path, { encoding: "base64" })
          )
        )
          .then((base64imageStrings) => {
            const images = {};
            Object.keys(data.images).forEach((key, idx) => {
              images[key] = "data:image/png;base64," + base64imageStrings[idx];
            });
            return images;
          })
          .then((base64ImageBlobs) => {
            return pug.renderFile(template, {
              ...data,
              images: base64ImageBlobs,
            });
          })
      );
    });

    return Promise.all(scoresheetHtmlPromises).then(
      async (scoresheetHtmlArray) => {
        const scoresheetHtml = scoresheetHtmlArray.join("");

        if (preview) {
          return scoresheetHtml;
        }

        let pages = await this.browser.pages();

        while (pages.length == MAX_SIMULTANEOUS_RENDERS) {
          pages = await this.browser.pages();
          await new Promise((r) => setTimeout(r, 1000));
        }

        const page = await this.browser.newPage();
        await page.setContent(scoresheetHtml);
        const pdfBuffer = await page.pdf({
          width: "8.5in",
          height: "11.0in",
          printBackground: true,
        });
        page.close();

        console.log(
          `PDF_SERVICE: Rendered ${allData.length} scoresheets for entry# ${
            allData[0].scoresheet.entry_number
          } in ${Date.now() - timerMetric}ms`
        );
        return pdfBuffer;
      }
    );
  }
}

const PDF_Service = new PdfService();

module.exports = PDF_Service;
