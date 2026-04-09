import pandas as pd

# Read the Excel file
excel_file = r'C:\Users\Haya Abid\Downloads\Balochistan winter school _teachers_phone numbers.xlsx'
df = pd.read_excel(excel_file)

# Clean up the data
df.columns = ['Name', 'Phone']
df['Phone'] = df['Phone'].astype(str).str.strip()

# Add +92 prefix to phone numbers
df['FullPhone'] = '92' + df['Phone']

# Get unique phone numbers (remove duplicates)
unique_phones = df['FullPhone'].unique().tolist()
unique_phones.sort()

# Create JavaScript/Python array format
print(f"Total unique phone numbers: {len(unique_phones)}\n")
print("=== JavaScript Array Format ===\n")
print("const COHORT_PHONES = [")
for i, phone in enumerate(unique_phones):
    comma = "," if i < len(unique_phones) - 1 else ""
    # Add line breaks every 5 numbers for readability
    if i % 5 == 0 and i > 0:
        print()
    print(f"  '{phone}'{comma}", end="")
print("\n];\n")

# Also create Python format
print("=== Python List Format ===\n")
print("COHORT_PHONES = [")
for i, phone in enumerate(unique_phones):
    comma = "," if i < len(unique_phones) - 1 else ""
    if i % 5 == 0 and i > 0:
        print()
    print(f"  '{phone}'{comma}", end="")
print("\n]\n")

# Save to a text file for easy copy-paste
with open('ALL_COHORT_PHONES.txt', 'w') as f:
    f.write("const COHORT_PHONES = [\n")
    for i, phone in enumerate(unique_phones):
        comma = "," if i < len(unique_phones) - 1 else ""
        if i % 5 == 0 and i > 0:
            f.write("\n")
        f.write(f"  '{phone}'{comma}")
    f.write("\n];\n")

print("Saved to: ALL_COHORT_PHONES.txt")
