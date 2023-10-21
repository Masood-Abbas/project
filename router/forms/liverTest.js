const express = require(`express`);
const router = new express.Router();
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require(`path`);
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const bodyParser = require("body-parser"); // Import body-parser

// Add body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  const {
    name,
    age,
    sex,
    bilirubinTotal,
    bilirubinConjugated,
    bilirubinUnconjugated,
    sgpt,
    sgot,
    alkalinePhosphatase,
    gammagt,
    totalProtein,
    albumine,
    globulins,
  } = req.body;

  const date = new Date().toLocaleDateString("en-GB");
  const logoPath = path.join(__dirname, "../../public/images/logo.png");

  console.log(logoPath);
  const logoBuffer = await readFileAsync(logoPath);
  const logoBase64 = logoBuffer.toString("base64");

  const patientData = {
    logo: `data:image/png;base64,${logoBase64}`,
    name,
    date,
    age,
    sex,
    liverTest: [
      {
        name: "Bilirubin Total",
        value: bilirubinTotal,
        unit: "mg/dL",
        normalValve: `0.2-1.2`,
      },
      {
        name: "Bilirubin Conjugated",
        value: bilirubinConjugated,
        unit: "mg/dL",
        normalValve: `less than 0.5`,
      },
      {
        name: "Bilirubin Unconjugated",
        value: bilirubinUnconjugated,
        unit: "mg/dL",
        normalValve: `0.1-1.0`,
      },
      {
        name: "S.G.P.T (A.L.T)",
        value: sgpt,
        unit: "U/L",
        normalValve: `5-55`,
      },
      {
        name: "S.G.O.T (A.S.T)",
        value: sgot,
        unit: "U/L",
        normalValve: `5-34`,
      },
      {
        name: "Alkaline Phosphatase",
        value: alkalinePhosphatase,
        unit: "U/L",
        normalValve: `40-150`,
      },
      {
        name: "Gamma G.T",
        value: gammagt,
        unit: "U/L",
        normalValve: `16-64`,
      },
      {
        name: "Total Protein",
        value: totalProtein,
        unit: "g/dL",
        normalValve: `6.0-8.5`,
      },
      {
        name: "Albumine",
        value: albumine,
        unit: "g/dL",
        normalValve: `3.5-5.0`,
      },
      {
        name: "Globulins",
        value: globulins,
        unit: "g/dL",
        normalValve: `1.8-3.4`,
      },
    ],
  };

  try {
    const templatePath = path.join(__dirname, "../../views/liverTest.hbs");
    const template = fs.readFileSync(templatePath, "utf8");

    // Compile the Handlebars template
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(patientData);

    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({ headless: "true" });
    const page = await browser.newPage();

    // Set the content of the page to the generated HTML
    await page.setContent(html);
    const imageSelector = "#logo-image"; // Replace with your actual selector
    await page.waitForSelector(imageSelector);
    const pdfFileName = `${Date.now()}.pdf`;

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    const pdfPath = path.join(__dirname, "../../public/pdf", pdfFileName);

    // Save the PDF to a file
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Close the browser
    await browser.close();

    console.log("PDF generated successfully!");

    // Set the 'Content-Type' header to 'application/pdf'
    res.set("Content-Type", "application/pdf");
    // Send the PDF as a download
    res.download(pdfPath, pdfFileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports = router;
