# Guest Management Scripts

This folder contains utility scripts for importing and exporting guest data from the Strapi backend.

## Setup

1. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Configure the `.env` file:
   - Update the `API_TOKEN` with your Strapi API token
   - Optionally update `API_BASE_URL` if your backend runs on a different URL
   - Optionally update `OUTPUT_DIR` to change where CSV files are saved

## Getting Your API Token

1. Log in to your Strapi admin panel (usually at `http://localhost:1337/admin`)
2. Go to **Settings** → **API Tokens**
3. Create a new API token with **full access** or at least `create`, `read`, `update`, and `delete` permissions for Guest and Guest Group content types
4. Copy the token and paste it in the `.env` file as `API_TOKEN`

## Scripts

### Export Guests (`export_guests.py`)

Downloads the current guest list from the database as a CSV file.

```bash
python export_guests.py
```

The script will download the guest list as a CSV file to the `downloads` folder (or the directory specified in `.env`).

**Output columns:**

- ID
- First Name
- Last Name
- Type (Adult/Child)
- Country
- RSVP (Yes/No)
- Attending (Yes/No)
- Guest Group

Files are automatically named with a timestamp: `guest-list-YYYY-MM-DD_HH-MM-SS.csv`

### Import Guests (`import_guests.py`)

Uploads a CSV file to populate the database with guest information.

```bash
python import_guests.py [path/to/file.csv]
```

If no file path is provided, it defaults to `Table.csv` in the scripts directory.

**⚠️ WARNING:** This script will:

- Delete ALL existing guests and guest groups
- Reset the ID counter to start at 1
- Import all guests from the CSV file

**CSV Format Expected:**

The CSV should have the following columns (in order):

1. Invitation Sent (ignored)
2. RSVP (true/false)
3. Attending (true/false)
4. Name (will be split into First Name and Last Name)
5. Address (ignored)
6. Group (guest group name - will be created if doesn't exist)
7. Table (ignored)
8. Type (Adult/Child)
9. Country

**Name Parsing:**

- Names are split by spaces
- First word becomes `firstName`
- Remaining words become `lastName`

**Group Handling:**

- If a group name exists, guests are linked to it
- If a group doesn't exist, it's created automatically
- Multiple guests can share the same group

**Example CSV Row:**

```
true,true,true,John Doe,,Smith Family,1,Adult,US
```

This creates a guest:

- First Name: John
- Last Name: Doe
- Guest Group: Smith Family (created if doesn't exist)
- Type: Adult
- Country: US
- RSVP: true
- Attending: true
