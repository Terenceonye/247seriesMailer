const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS
require('dotenv').config(); // For loading environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors())
app.use(bodyParser.json());

// Route to handle contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message, website } = req.body;

    if (!name || !email || !subject || !message || !website) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Use Environment variable for Email host
        port: 465, // Use 587 for SSL
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable for email
            pass: process.env.EMAIL_PASS,  // Use environment variable for email password
        },
    });

    // Email options with HTML formatting
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender name and email
        to: 'onyeweketerence@gmail.com', // The email address where you'll receive messages
        subject: `New Contact Form Submission from ${website}: ${subject}`,
        html: `
        <h2 style="color: #333; font-family: Arial, sans-serif;">New Message from ${name}</h2>
        <p style="font-size: 16px; color: #555;">
            <strong>Website:</strong> ${website} <br>
            <strong>Sender:</strong> ${name} (<a href="mailto:${email}">${email}</a>)<br>
            <strong>Subject:</strong> ${subject}
        </p>
        <h3 style="color: #333; font-family: Arial, sans-serif;">Message:</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #555; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #00BF63;">
            ${message}
        </p>
        <br>
        <p style="font-size: 14px; color: #777;">
            This message was submitted from the website: <strong>${website}</strong>
        </p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error details:', error); // Log error details for debugging
            return res.status(500).json({ success: false, error: 'Error sending email.' });
        } else {
            return res.status(200).json({ success: true, message: 'Message sent successfully!' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
