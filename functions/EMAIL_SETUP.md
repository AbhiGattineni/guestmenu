# Email Notification Setup

This function sends email notifications to hosts when orders are placed.

## Configuration

You need to configure email credentials using Firebase Functions config or environment variables.

### Option 1: Using Firebase Functions Config (Recommended)

```bash
firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
```

**Note:** For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### Option 2: Using Environment Variables

Set these environment variables in your Firebase project:
- `EMAIL_USER`: Your email address
- `EMAIL_PASSWORD`: Your email password or app password

## Gmail Setup

1. Enable 2-Step Verification on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this app password in the configuration (not your regular Gmail password)

## Other Email Providers

You can modify the transporter configuration in `functions/index.js` to use other email services:

- **SendGrid**: Use `service: 'SendGrid'` and provide API key
- **Mailgun**: Use `host: 'smtp.mailgun.org'` and provide credentials
- **Custom SMTP**: Configure with your SMTP server details

## Testing

After deploying, the function will automatically trigger when a new order is created in:
```
orders/{hostUserId}/orders/{orderId}
```

The email will be sent to the host's email address stored in their profile at:
```
users/{hostUserId}/profile/email
```

## Deployment

```bash
firebase deploy --only functions:sendOrderNotificationEmail
```

