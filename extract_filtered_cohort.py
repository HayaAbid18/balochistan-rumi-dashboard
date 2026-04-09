#!/usr/bin/env python3
"""
Extract phone numbers from the filtered teacher list PDF
"""

# All phone numbers from the filtered cohort PDF
phones_10digit = [
    # Page 1
    '3084180356', '3330036176', '3138347824', '3327973445', '3333573583',
    '3138293573', '3318381061', '3337946655', '3363758243', '3333543930',
    '3346728606', '3003833001', '3110067199', '3117469641', '3123691611',
    '3411366603', '3158020406', '3422042524', '3337812223', '3273175877',
    '3128656305', '3138775231', '3333231376', '3333034829', '3327850957',
    '3468319667', '3368020655', '3013772159', '3401249758', '3333809133',
    '3333089133',
    # Page 2
    '3353886056', '3348635352', '3138639063', '3342402939', '3418163945',
    '3187751850', '3323402593', '3171280012', '3337872446', '3327821014',
    '3168754009', '3003886529', '3130821054', '3183963107', '3138366526',
    '3358775056', '3360896121', '3312159674', '3218119065', '3342893756',
    '3404770019', '3158471302', '3218137693', '3138408602', '3351289226',
    '3168052728', '3402561945', '3374403473', '3180001644', '3358763443',
    '3150377118',
    # Page 3
    '3333572105', '3318013708', '3321744861', '3333441551', '3058053829',
    '3132601026', '3323274385', '3193232024', '3316801661', '3432911164',
    '3335760459', '3317170188', '3138719167', '3330760276', '3337851933',
    '3332408634', '3104154676', '3138103177', '3366041711', '3246994366'
]

# Convert to full Pakistan numbers and remove duplicates
unique_phones = sorted(set(['92' + phone for phone in phones_10digit]))

print(f"Total teachers in filtered cohort: {len(unique_phones)}\n")
print("const COHORT_PHONES = [")
for i, phone in enumerate(unique_phones):
    comma = "," if i < len(unique_phones) - 1 else ""
    if i % 5 == 0 and i > 0:
        print()
    print(f"  '{phone}'{comma}", end="")
print("\n];\n")

# Save to file for reference
with open('FILTERED_COHORT_PHONES.txt', 'w') as f:
    f.write("const COHORT_PHONES = [\n")
    for i, phone in enumerate(unique_phones):
        comma = "," if i < len(unique_phones) - 1 else ""
        if i % 5 == 0 and i > 0:
            f.write("\n")
        f.write(f"  '{phone}'{comma}")
    f.write("\n];\n")

print("Saved to: FILTERED_COHORT_PHONES.txt")
