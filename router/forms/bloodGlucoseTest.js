const express = require('express');
const router = new express.Router();
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const bodyParser = require('body-parser');
const fsExtra = require('fs-extra');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  const {
    pdfName,
    email,
    name,
    age,
    sex,
    fastingBloodSugar,
    postprandialBloodSugar,
    randomBloodSugar,
    insulinLevel,
    hba1c,
    cholesterol,
  } = req.body;

  const date = new Date().toLocaleDateString('en-GB');

  // logo image convert base64
  const logoPath = path.join(__dirname, '../../public/images/logo.png');
  const logoBuffer = await readFileAsync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  // stamp image
  const stampPath = path.join(__dirname, '../../public/images/stamp.png');
  const stampBuffer = await readFileAsync(stampPath);
  const stampBase64 = stampBuffer.toString('base64');

  const patientData = {
    stamp: `data:image/png;base64,${stampBase64}`,
    logo: `data:image/png;base64,${logoBase64}`,
    pdfName,
    name,
    email,
    date,
    age,
    sex,
    bloodGlucoseTest: [
      {
        name: 'Fasting Blood Sugar',
        value: fastingBloodSugar,
        unit: ' mg/dL',
        normalValve: `70-100 mg/dL`,
      },
      {
        name: 'Postprandial Blood Sugar',
        value: postprandialBloodSugar,
        unit: ' mg/dL',
        normalValve: '70-140 mg/dL',
      },
      {
        name: 'Random Blood Sugar',
        value: randomBloodSugar,
        unit: ' mg/dL',
        normalValve: '70-200 ',
      },
      {
        name: 'Cholesterol Level',
        value: cholesterol,
        unit: ' mg/dL',
        normalValve: 'Less Than 200',
      },
      {
        name: 'Insulin Level',
        value: insulinLevel,
        unit: ' uU/mL ',
        normalValve: '2-25',
      },
      {
        name: 'HbA1c',
        value: hba1c,
        unit: '%',
        normalValve: 'Less Than 5.7',
      },
    ],
  };

  try {
    const templatePath = path.join(__dirname, '../../views/bloodGlucoseTest.hbs');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Compile the Handlebars template
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(patientData);

    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({ headless: 'true' });
    const page = await browser.newPage();

    // Set the content of the page to the generated HTML
    await page.setContent(html);
    const imageSelector = '.logo-image'; 
    await page.waitForSelector(imageSelector);

    const pdfFileName = `${pdfName}.pdf`;

    // Generate a PDF from the page
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    const pdfPath = path.join(__dirname, '../../public/pdf', pdfFileName);

    // Save the PDF to a file
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Close the browser
    await browser.close();
    console.log('PDF generated successfully!');
    // Delete the Pdf
    schedulePdfDeletion(pdfPath);

    // Send success response for PDF generation
    res.status(200).send('PDF generated successfully');
  } catch (pdfError) {
    console.error('Error generating PDF:', pdfError);

    // Send error response for PDF generation
    res.status(500).json({ error: 'Error generating PDF' });
  }

  try {
    // send mail to patient to pdf name
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'information',
      text: `You can download the pdf our website your pdf name is ${pdfName}`,
    };

    // send email
    const emailInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!', emailInfo.response);

    // Send success response for email
    res.status(201).send('Email sent successfully');
  } catch (emailError) {
    console.error('Error sending email:', emailError);

    // Send error response for email
    res.status(404).send('Error occurred while sending email');
  }
});
module.exports = router;
