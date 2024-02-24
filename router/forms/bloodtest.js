const express = require(`express`);
const router = new express.Router();
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const path = require(`path`);
const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const bodyParser = require("body-parser"); 


router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  const {
   email,
    pdfName,
    name,
    age,
    sex,
    hemoglobin,
    wbcCount,
    lekocyte,
    bloodSedimentationRate,
    trombositeAmount,
    hematocrite,
    erythrocyte,
    plateletCount,
    mcv,
    mch,
    mchc,
    eosinophil,
    basophil,
    neutrophil,
    monocytes,
    lymphocytes,
  } = req.body;

  const date = new Date().toLocaleDateString("en-GB");
  // convert image in base64
  const logoPath = path.join(__dirname, "../../public/images/logo.png");
  const logoBuffer= await readFileAsync(logoPath)
  const logoBase64= logoBuffer.toString("base64")
  const patientData = {
    logo:`data:image/png;base64,${logoBase64}`,
    pdfName,
   email,
    name,
    date,
    age,
    sex,
    cbcTests: [
      {
        name: "Hemoglobin",
        value: hemoglobin,
        unit: "g/dL",
        normalValve: `M:13.8 - 17.2 , F: 12.1 - 15.1`,
      },
      {
        name: "Blood Sedimentation Rate",
        value: bloodSedimentationRate,
        unit: "mm/1hr",
        normalValve: "M: 0 - 15 , F: 0 - 20",
      },
      {
        name: "Hematocrite",
        value: hematocrite,
        unit: "%",
        normalValve: "M:40.0 - 50 , F: 35 - 45",
      },
      {
        name: "Erythrocyte",
        value: erythrocyte,
        unit: "x10^12/L",
        normalValve: "M:4.4 - 5.6 , F:3.8 - 5.0",
      },
      {
        name: "WBC Count",
        value: wbcCount,
        unit: "x10^3/µL",
        normalValve: "4 - 11",
      },
      {
        name: "Lekocyte",
        value: lekocyte,
        unit: "x10^9/L",
        normalValve: " 3.2 - 10.0 ",
      },

      {
        name: "Trombosite Amount",
        value: trombositeAmount,
        unit: "x10^9/L",
        normalValve: "170 - 380",
      },
      {
        name: "Platelet Count",
        value: plateletCount,
        unit: "x10^9/L",
        normalValve: "150 - 400 ",
      },
      { name: "MCV", value: mcv, unit: "FL", normalValve: "75 - 95" },
      { name: "MCH", value: mch, unit: "pg", normalValve: "26 - 32" },
      { name: "MCHC", value: mchc, unit: "g/dl", normalValve: "30 - 35" },
      {
        name: "Eosinophil",
        value: eosinophil,
        unit: "%",
        normalValve: "0 - 6.0",
      },
      { name: "Basophil", value: basophil, unit: "%", normalValve: "0 - 2.0" },
      {
        name: "Neutrophil",
        value: neutrophil,
        unit: "%",
        normalValve: "40.0 - 75.0",
      },
      {
        name: "Monocytes",
        value: monocytes,
        unit: "%",
        normalValve: "2.0 - 10.0",
      },
      {
        name: "Lymphocytes",
        value: lymphocytes,
        unit: "%",
        normalValve: "20.0 - 50.0",
      },
      // Add more CBC test results here
    ],
  };
  try {
    const templatePath = path.join(__dirname, "../../views/bloodtest.hbs");
    const template = fs.readFileSync(templatePath, "utf8");

    // Compile the Handlebars template
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(patientData);

    // Create an HTML string by rendering the template with data

    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set the content of the page to the generated HTML
    await page.setContent(html);
    const pdfFileName = `${pdfName}.pdf`

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    const pdfPath = path.join(__dirname, "../../public/pdf", pdfFileName);

    // Save the PDF to a file
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Close the browser
    await browser.close();

    console.log("PDF generated successfully!");
    res.send("PDF generated successfully!");
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
   
  // send mail to patient to pdf name
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "information",
    text: `You can download the pdf our website your pdf name is ${pdfName}`
  };

  // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: " + error);
      res.status(404).send("Error occurred while sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(201).send("Email sent successfully");
    }
  });
});

module.exports = router;
