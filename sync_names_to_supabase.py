import pandas as pd
import os

# Read the Excel file
excel_file = r'C:\Users\Haya Abid\Downloads\Balochistan winter school _teachers_phone numbers.xlsx'
df = pd.read_excel(excel_file)

# Clean up the data
df.columns = ['Name', 'Phone']
df['Phone'] = df['Phone'].astype(str).str.strip()

# Add +92 prefix to phone numbers
df['FullPhone'] = '92' + df['Phone']

# Create SQL UPDATE statements
print("=== SQL UPDATE STATEMENTS ===\n")
print("BEGIN TRANSACTION;\n")

for idx, row in df.iterrows():
    name = row['Name'].strip()
    phone = row['FullPhone']

    # Escape single quotes in names
    name_escaped = name.replace("'", "''")

    sql = f"UPDATE users SET first_name = '{name_escaped}' WHERE phone_number = '{phone}';"
    print(sql)

print("\nCOMMIT;")

# Create CSV for reference
print("\n\n=== CSV MAPPING (for reference) ===")
output_df = df[['Name', 'FullPhone']].copy()
output_df.columns = ['name', 'phone']
output_df.to_csv('teacher_names_mapping.csv', index=False)
print("Saved to: teacher_names_mapping.csv")

# Print summary
print(f"\n✅ Total teachers to sync: {len(df)}")
print(f"Phone number range: {df['FullPhone'].min()} to {df['FullPhone'].max()}")

# Check for duplicates
duplicates = df[df.duplicated(subset=['Phone'], keep=False)]
if len(duplicates) > 0:
    print(f"\n⚠️  Found {len(duplicates)} duplicate phone numbers:")
    print(duplicates[['Name', 'Phone']])
