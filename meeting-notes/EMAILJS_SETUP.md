# EmailJS Setup Guide

This guide will help you set up EmailJS to send emails directly from the Housekeeping Manager Notes app.

## Overview

EmailJS allows you to send emails from client-side JavaScript without needing a backend server. It's free for up to 200 emails per month.

## Step-by-Step Setup

### 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add an Email Service

1. After logging in, click on "Email Services" in the left sidebar
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Office365**
   - **Yahoo**
   - Or any other supported provider
4. Follow the authentication steps (you may need to allow "less secure apps" or use app-specific passwords)
5. Give your service a name (e.g., "Housekeeping Manager")
6. Click "Create Service"
7. **Copy the Service ID** (looks like `service_xxxxxxx`) - you'll need this later

### 3. Create an Email Template

1. Click on "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Give your template a name (e.g., "Meeting Summary")
4. In the template editor, use these variables:
   ```
   Subject: {{subject}}

   To: {{to_name}} <{{to_email}}>
   From: {{from_name}} <{{from_email}}>

   {{message}}
   ```
5. Customize the template design if desired
6. Click "Save"
7. **Copy the Template ID** (looks like `template_xxxxxxx`) - you'll need this later

### 4. Get Your Public Key

1. Click on "Account" in the top navigation
2. Go to "API Keys" section
3. **Copy your Public Key** (a long string of characters)
4. Keep this key private - don't share it publicly

### 5. Configure the App

1. Open the Housekeeping Manager Notes app
2. Click the "🔐 Login" button in the header
3. Enter your information:
   - **Email Address**: Your email address (the one you want to send from)
   - **Your Name**: Your full name
   - **Service ID**: Paste the Service ID from step 2
   - **Template ID**: Paste the Template ID from step 3
   - **Public Key**: Paste the Public Key from step 4
4. Click "Login & Save"

## Usage

Once configured:

1. Create or open a meeting
2. Add staff members as attendees
3. Click the "📧 Email Summary" button
4. The app will send individual emails to each selected attendee automatically

## Troubleshooting

### Email Not Sending

- **Check your EmailJS dashboard** for error logs
- Verify all three IDs (Service, Template, Public Key) are correct
- Make sure your email service is properly authenticated
- Check that you haven't exceeded the 200 emails/month limit on the free plan

### Authentication Issues

- For Gmail, you may need to:
  - Enable 2-factor authentication
  - Create an app-specific password
  - Allow access for less secure apps
- For Outlook/Office365, make sure you've completed OAuth authentication

### Template Variables Not Working

Make sure your template includes these variables:
- `{{to_email}}` - Recipient's email
- `{{to_name}}` - Recipient's name
- `{{from_name}}` - Your name
- `{{from_email}}` - Your email
- `{{subject}}` - Email subject
- `{{message}}` - Email body content

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email services
- Unlimited email templates
- Standard support

If you need more emails, consider upgrading to a paid plan.

## Security Notes

- Your EmailJS credentials are stored locally in your browser
- They are never sent to any server except EmailJS
- Click "Logout" to remove your credentials from the device
- Use app-specific passwords instead of your main email password when possible

## Support

For EmailJS-specific issues, visit:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)

For app-specific issues, check the main README.md file.
