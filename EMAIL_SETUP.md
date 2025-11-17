# RSVP Email Notification Setup

## Overview

This setup enables automatic email notifications to `benjamin.gra572@gmail.com` whenever someone submits an RSVP through your wedding website.

## What Was Implemented

### 1. Email Provider Installation

- Installed `@strapi/provider-email-nodemailer` package to enable email functionality in Strapi

### 2. Email Configuration (`config/plugins.ts`)

- Configured the email plugin to use your existing Zoho email credentials from `.env`:
  - Host: `smtp.zoho.com`
  - Port: `587`
  - Username: `noreply@songbooksofpraise.com`
  - Password: From `MAIL_PASSWORD` environment variable

### 3. Styled Email Template (`src/api/guest/services/emailTemplate.ts`)

- Created a beautiful HTML email template matching your wedding website's design
- Uses the same color palette:
  - Forest Green (`#6B8068`)
  - Sage (`#9BAA97`)
  - Cream (`#F4F6F3`)
  - Pine (`#556B52`)
- Uses the same fonts:
  - Playfair Display (headers)
  - Cormorant (subheaders)
  - Montserrat (body text)

### 4. Email Service (`src/api/guest/services/guest.ts`)

- Added `sendRSVPNotification()` method to handle email sending
- Logs success/failure for monitoring

### 5. RSVP Controller Update (`src/api/guest/controllers/guest.ts`)

- Modified the `submitRSVP` endpoint to automatically send email notifications
- Email sending is non-blocking - if it fails, the RSVP still succeeds
- Fetches complete guest group details for the email

## Email Content

Each email notification includes:

✅ **Guest Group Name** - Prominently displayed at the top

✅ **Attending Guests** - List of all guests who are attending with their:

- Full name
- Type (Adult/Child)
- Country

✅ **Not Attending Guests** - List of guests who declined with same details

✅ **Special Wishes** - Any message the guest group included

✅ **Summary Statistics**:

- Total guests in the group
- Number attending
- Number not attending

✅ **Timestamp** - When the RSVP was submitted

## Testing

To test the email functionality:

1. Make sure your Strapi server is running:

   ```bash
   npm run develop
   ```

2. Submit an RSVP through your frontend application

3. Check `benjamin.gra572@gmail.com` for the notification email

4. Check Strapi logs for confirmation:
   ```
   RSVP notification email sent for group: [Group Name]
   ```

## Troubleshooting

If emails aren't being received:

1. **Check Environment Variables**: Ensure `.env` has correct email credentials
2. **Check Strapi Logs**: Look for error messages about email sending
3. **Verify SMTP Settings**: Confirm Zoho SMTP is accessible from your server
4. **Check Spam Folder**: Email might be filtered as spam initially
5. **Test Email Plugin**: You can test the email service directly in Strapi admin

## Files Modified

- `config/plugins.ts` - Email plugin configuration
- `src/api/guest/services/emailTemplate.ts` - HTML email template (NEW)
- `src/api/guest/services/guest.ts` - Email sending logic
- `src/api/guest/controllers/guest.ts` - RSVP submission with email trigger

## Notes

- The email uses inline CSS for maximum email client compatibility
- Google Fonts are loaded for proper font rendering
- The design is responsive and works on mobile email clients
- Email sending is non-blocking to ensure RSVPs are recorded even if email fails
- All email errors are logged for debugging
