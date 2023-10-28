const express = require(`express`);
const router = new express.Router();
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require(`path`);
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  const {
    pdfName,
    name,
    age,
    sex,
    totalCholesterol,
    ldlCholesterol,
    hdlCholesterol,
    triglycerides,
  } = req.body;

  const date = new Date().toLocaleDateString("en-GB");
  // logo image convert baase 64
  const logoPath = path.join(__dirname, "../../public/images/logo.png");
  const logoBuffer = await readFileAsync(logoPath);
  const logoBase64 = logoBuffer.toString("base64");

  const patientData = {
    logo: `data:image/png;base64,${logoBase64}`,
    pdfName,
    name,
    date,
    age,
    sex,
    lipidProfileTest: [
      {
        name: "Total Cholesterol",
        value: totalCholesterol,
        unit: " mg/dL",
        normalValve: `Less Than 200`,
      },
      {
        name: "LDL Cholesterol",
        value: ldlCholesterol,
        unit: " mg/dL",
        normalValve: "Less Than 100",
      },
      {
        name: "HDL Cholesterol",
        value: hdlCholesterol,
        unit: " mg/dL",
        normalValve: "Less Than 40 ",
      },
      {
        name: "Triglycerides",
        value: triglycerides,
        unit: " mg/dL",
        normalValve: "Less Than 150",
      },
     
    ],
  };

  try {
    const templatePath = path.join(
      __dirname,
      "../../views/lipidProfileTest.hbs"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Compile the Handlebars template
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(patientData);

    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({ headless: "true" });
    const page = await browser.newPage();

    // Set the content of the page to the generated HTML
    await page.setContent(html);
    const imageSelector = "#logo-image";
    await page.waitForSelector(imageSelector);

    const pdfFileName = `${pdfName}.pdf`

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    const pdfPath = path.join(__dirname, "../../public/pdf", pdfFileName);

    // Save the PDF to a file
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Close the browser
    await browser.close();

    console.log("PDF generated successfully!");
    res.send(`PDF generated successfully`)

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports = router;
