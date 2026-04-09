# Sync Teacher Names to Supabase

## Overview
The Excel file contains 100+ teacher names and phone numbers. These need to be synced to Supabase so the dashboard shows real names instead of "Unknown".

## Step 1: Generate SQL Updates

Run this command to generate the SQL:
```bash
python sync_names_to_supabase.py
```

This creates SQL UPDATE statements that map phone numbers to teacher names.

## Step 2: Copy the SQL Updates

The output shows SQL like:
```sql
BEGIN TRANSACTION;

UPDATE users SET first_name = 'ABDUL REHMAN' WHERE phone_number = '923084180356';
UPDATE users SET first_name = 'Abdul Qadir' WHERE phone_number = '923330036176';
-- ... 100+ more updates
COMMIT;
```

## Step 3: Run SQL in Supabase

1. **Go to Supabase Dashboard**
   - https://app.supabase.com
   - Select your project
   - Click **SQL Editor**

2. **Create new query**
   - Click **New query**
   - Paste all the SQL UPDATE statements from the Python output

3. **Execute**
   - Click **Run** (or Ctrl+Enter)
   - Wait for confirmation

## Step 4: Verify

After running the updates, your dashboard will show teacher names instead of "Unknown"!

Example:
```
✅ ABDUL REHMAN        923084180356  137 messages  HIGHLY ACTIVE
✅ Abdul Salam         923327973445  45 messages   RECENTLY ACTIVE
✅ Hina Ashraf         923468319667  32 messages   MODERATELY ACTIVE
```

## Next: Filter by Cohort

Once names are synced, let me know which phone numbers should be included in the **March 17th Balochistan cohort** and I'll update the dashboard to track only those users.

This will:
- Focus metrics on the specific cohort
- Exclude test/internal users
- Show accurate cohort statistics

## Files Generated

- `sync_names_to_supabase.py` - Script to generate SQL
- `teacher_names_mapping.csv` - CSV mapping of all names and phones (for reference)

---

**Total Teachers**: ~100  
**Action**: Update `first_name` field in `users` table by phone number  
**Time**: < 1 minute in Supabase
