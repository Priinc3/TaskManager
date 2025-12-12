# n8n Workflow Setup for TaskFlow Reminders

This guide explains how to set up the n8n workflow to send personalized email reminders for tasks.

## Workflow Overview

```
┌─────────────┐    ┌──────────────────┐    ┌───────────────┐    ┌──────────────┐
│ Every Minute │───▶│ Fetch Reminders  │───▶│ Has Reminders?│───▶│ Split Items  │
└─────────────┘    └──────────────────┘    └───────────────┘    └──────────────┘
                                                                        │
                                                                        ▼
┌───────────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐
│ Mark as Sent (API)│◀───│ Collect IDs  │◀───│ Extract ID   │◀───│ Send Gmail │
└───────────────────┘    └──────────────┘    └──────────────┘    └────────────┘
```

## Setup Steps

### Step 1: Import the Workflow

1. Open your n8n instance
2. Click **"Add workflow"** → **"Import from file"**
3. Select `n8n/taskflow-reminders-workflow.json`

### Step 2: Set Environment Variables

In n8n, go to **Settings → Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `TASKFLOW_API_URL` | `https://your-app.vercel.app` | Your deployed TaskFlow URL |
| `TASKFLOW_API_KEY` | `taskflow-n8n-api-key-2024` | API key from your .env.local |
| `TASKFLOW_APP_URL` | `https://your-app.vercel.app` | URL for email links |

### Step 3: Connect Gmail

1. Click on the **"Send Gmail"** node
2. Click **"Create new credential"**
3. Follow OAuth setup to connect your Gmail account
4. Grant permissions for sending emails

### Step 4: Activate the Workflow

1. Toggle the workflow to **Active**
2. The workflow will now run every minute

---

## How It Works

### 1. Fetch Reminders
The workflow calls your TaskFlow API:
```
GET /api/reminders
Authorization: Bearer YOUR_API_KEY
```

Returns:
```json
{
  "reminders": [
    {
      "id": "reminder-uuid",
      "task": {
        "title": "Complete project proposal",
        "description": "Write the Q1 proposal",
        "priority": "high",
        "due_date": "2024-01-15T14:00:00Z"
      },
      "user": {
        "full_name": "John Doe"
      },
      "user_email": "john@example.com"
    }
  ]
}
```

### 2. Send Personalized Email

Each reminder triggers a beautiful HTML email:

**Subject:** `⏰ Reminder: Complete project proposal`

**Email includes:**
- User's name greeting
- Task title with priority badge
- Task description
- Due date formatted nicely
- Call-to-action button to open TaskFlow

### 3. Mark as Sent

After sending all emails, the workflow calls:
```
POST /api/reminders
Authorization: Bearer YOUR_API_KEY

{
  "reminder_ids": ["uuid-1", "uuid-2"]
}
```

This prevents duplicate notifications.

---

## Email Template Preview

The email looks like this:

```
┌────────────────────────────────────────────┐
│                 ✓ TaskFlow                 │
├────────────────────────────────────────────┤
│                                            │
│  Hi John,                                  │
│                                            │
│  This is a reminder for your task:         │
│                                            │
│  📌 Complete project proposal              │
│  ┌──────────────────────────────────────┐  │
│  │ HIGH PRIORITY                        │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Write the Q1 proposal                     │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ 📅 Due Date                          │  │
│  │ Monday, January 15, 2024 at 2:00 PM  │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │         Open TaskFlow →              │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

---

## Testing

1. Create a task in TaskFlow with a due date
2. Add a reminder set to "now" or a few minutes from now
3. Wait for the n8n workflow to trigger
4. Check your email!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No emails sent | Check Gmail credentials are connected |
| API errors | Verify TASKFLOW_API_URL and API key |
| Wrong email format | Check user_email field in database |
| Duplicate emails | Check is_sent flag in reminders table |

---

## Customization

### Change Email Frequency
Edit the "Every Minute" node to run less frequently:
- Every 5 minutes
- Every hour
- Custom cron expression

### Modify Email Template
Edit the HTML in the "Send Gmail" node to customize:
- Colors and branding
- Layout and spacing
- Additional task details

### Add Slack/Discord Notifications
Add additional nodes after "Split Into Items" to send to other channels.
