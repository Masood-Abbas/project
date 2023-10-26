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
  const { pdfName,name, age, sex, glucose, protein, ketones, blood, pH ,color,bilirubin,urobilinkogen,nitrites} = req.body;

  const date = new Date().toLocaleDateString("en-GB");

  const logoPath = path.join(__dirname, "../../public/images/logo.png");
  const logoBuffer = await readFileAsync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');

  const testData = {
    logo: `data:image/png;base64,${logoBase64}`,
    pdfName,
    name,
    date,
    age,
    sex,
    urineTestData: [
      {
        name: " Glucose",
        value: glucose,
        unit: " mg/dL",
        normalValve: `Negative (no glucose should be present)`,
      },
      {
        name: " Protein",
        value: protein,
        unit: " mg/dL",
        normalValve: `Less than 150 mg/dL`,
      },
      {
        name: " Ketones",
        value: ketones,
        unit: " mg/dL",
        normalValve: ` Less than 10 mg/dL`,
      },  
      {
        name: "Urobilinkogen",
        value: urobilinkogen,
        unit: "mg/dL",
        normalValve:  `0.2 to 1.0  `,
      },
      {
        name: " Blood",
        value: blood,
        unit: " cells/HPF",
        normalValve:  `Negative (no blood should be present)`,
      },
        {
          name: " Color",
          value: color,
          unit: "",
          normalValve: `yellow`,
        },
           {
          name: "pH",
          value: pH,
          unit: "",
          normalValve:  ` 4.6 to 8.0 `,
        },
      {
        name: "Bilirubin",
        value: bilirubin,
        unit: " ",
        normalValve:  `Negative`   ,
      },  {
        name: "Nitrites",
        value: nitrites,
        unit: " ",
        normalValve:`Negative`,
      }
    
    ],
  };
  try {
    const templatePath = path.join(__dirname, "../../views/urineTest.hbs");
    const template= await fs.readFileSync(templatePath,`utf-8`)

    const compiledTemplate=handlebars.compile(template)
    const html=compiledTemplate(testData)

    const browser=await puppeteer.launch({headless: "true" })
    const page=await browser.newPage()
    await page.setContent(html)
    const imageSelector = "#logo-image"; // Replace with your actual selector
    await page.waitForSelector(imageSelector);

// pdf name
    const pdfFileName = `${pdfName}.pdf`

    // generate pdf
    const pdfBuffer= await page.pdf({format:"A4",printBackground:true})
// location where pdf is store
    const pdfPath=path.join(__dirname,`../../public/pdf`,pdfFileName)
    // save the file
    fs.writeFileSync(pdfPath,pdfBuffer)
    await browser.close()
    console.log("PDF generated successfully!");



  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports=router