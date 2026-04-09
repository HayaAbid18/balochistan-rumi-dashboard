import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from sqlalchemy import create_engine

engine = create_engine(
    'postgresql://analyst.jlpenspfdcwxkopaidys:RumiAnalyst2026secure@'
    'aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
)

# Split into smaller queries to avoid timeout

df_base = pd.read_sql("""
SELECT
    COALESCE(u.region, 'Unknown') as region,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT u.id) FILTER (WHERE u.registration_completed) as registered_users
FROM users u
WHERE LEFT(u.phone_number, 2) = '92'
  AND COALESCE(u.is_test_user, false) = false
GROUP BY COALESCE(u.region, 'Unknown')
ORDER BY total_users DESC
""", engine)

df_feats = pd.read_sql("""
SELECT
    COALESCE(u.region, 'Unknown') as region,
    COUNT(DISTINCT lpr.id) as lesson_plans,
    COUNT(DISTINCT cs.id) as coaching,
    COUNT(DISTINCT ra.id) as reading_assessments,
    COUNT(DISTINCT vr.id) as videos,
    COUNT(DISTINCT iar.id) as image_analysis
FROM users u
LEFT JOIN lesson_plan_requests lpr ON lpr.user_id = u.id AND lpr.status = 'completed'
LEFT JOIN coaching_sessions cs ON cs.user_id = u.id AND cs.status = 'completed'
LEFT JOIN reading_assessments ra ON ra.user_id = u.id AND ra.status = 'completed'
LEFT JOIN video_requests vr ON vr.user_id = u.id AND vr.status = 'completed'
LEFT JOIN image_analysis_requests iar ON iar.user_id = u.id AND iar.status = 'completed'
WHERE LEFT(u.phone_number, 2) = '92'
  AND COALESCE(u.is_test_user, false) = false
GROUP BY COALESCE(u.region, 'Unknown')
""", engine)

df_msgs = pd.read_sql("""
SELECT COALESCE(u.region, 'Unknown') as region,
       COUNT(c.id) as total_messages
FROM users u
JOIN conversations c ON c.user_id = u.id AND c.role = 'user'
WHERE LEFT(u.phone_number, 2) = '92'
  AND COALESCE(u.is_test_user, false) = false
GROUP BY COALESCE(u.region, 'Unknown')
""", engine)

df = df_base.merge(df_feats, on='region', how='left').merge(df_msgs, on='region', how='left')
df['total_messages'] = df['total_messages'].fillna(0).astype(int)

df['total_features'] = df[['lesson_plans','coaching','reading_assessments','videos','image_analysis']].sum(axis=1)
df['reg_rate'] = (df['registered_users'] / df['total_users'] * 100).round(1)
df['region'] = df['region'].str.title()

print("=== PAKISTAN REGIONAL BREAKDOWN ===")
print(df[['region','total_users','registered_users','reg_rate','lesson_plans','coaching',
          'reading_assessments','videos','image_analysis','total_messages']].to_string(index=False))

# known regions only (exclude Unknown for breakdown chart but show in user chart)
df_known = df[df['region'] != 'Unknown'].copy()

colors_region = ['#4e9af1','#f97316','#22c55e','#a855f7','#f43f5e','#facc15']
feature_cols = ['lesson_plans','coaching','reading_assessments','videos','image_analysis']
feature_labels = ['Lesson Plans','Coaching','Reading Assessments','Videos','Image Analysis']
feat_colors = ['#4e9af1','#f97316','#22c55e','#a855f7','#f43f5e']

fig = plt.figure(figsize=(18, 12))
fig.patch.set_facecolor('#0f1117')

# 1 - Users by region (all incl unknown)
ax1 = fig.add_axes([0.04, 0.62, 0.27, 0.30])
ax1.set_facecolor('#1a1d27')
regions_all = df['region'].tolist()
users_all = df['total_users'].tolist()
reg_all = df['registered_users'].tolist()
x = np.arange(len(regions_all))
w = 0.35
b1 = ax1.bar(x - w/2, users_all, width=w, color='#4e9af1', edgecolor='none', label='Total')
b2 = ax1.bar(x + w/2, reg_all, width=w, color='#22c55e', edgecolor='none', label='Registered')
for xi, (t, r) in enumerate(zip(users_all, reg_all)):
    ax1.text(xi - w/2, t + 15, f'{t:,}', ha='center', color='#4e9af1', fontsize=7)
    ax1.text(xi + w/2, r + 15, f'{r:,}', ha='center', color='#22c55e', fontsize=7)
ax1.set_xticks(x)
ax1.set_xticklabels(regions_all, color='#8b949e', fontsize=8, rotation=15)
ax1.set_title('Users by Region (Pakistan)', color='white', fontsize=11, fontweight='bold', pad=8)
ax1.set_ylabel('Users', color='#8b949e', fontsize=9)
ax1.tick_params(colors='#8b949e')
for spine in ax1.spines.values(): spine.set_color('#2d3142')
ax1.legend(fontsize=8, frameon=False, labelcolor='#8b949e')

# 2 - Registration rate by known region (donut)
ax2 = fig.add_axes([0.35, 0.60, 0.26, 0.36])
ax2.set_facecolor('#0f1117')
wedges, texts, autotexts = ax2.pie(
    df_known['total_users'], labels=None,
    colors=colors_region[:len(df_known)],
    autopct='%1.1f%%', startangle=140,
    wedgeprops=dict(width=0.55, edgecolor='#0f1117', linewidth=2),
    pctdistance=0.78
)
for at in autotexts:
    at.set_color('white'); at.set_fontsize(9)
ax2.set_title('User Share by Region\n(excl. Unknown)', color='white', fontsize=11, fontweight='bold')
patches = [mpatches.Patch(color=colors_region[i], label=f"{r} ({df_known['reg_rate'].iloc[i]}% reg)")
           for i, r in enumerate(df_known['region'])]
ax2.legend(handles=patches, loc='lower center', bbox_to_anchor=(0.5, -0.18),
           ncol=2, fontsize=8, frameon=False, labelcolor='#8b949e')

# 3 - Messages by region
ax3 = fig.add_axes([0.68, 0.62, 0.27, 0.30])
ax3.set_facecolor('#1a1d27')
bars3 = ax3.barh(df['region'], df['total_messages'],
                 color=colors_region[:len(df)], edgecolor='none', height=0.6)
for bar, val in zip(bars3, df['total_messages']):
    ax3.text(bar.get_width() + 50, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', color='white', fontsize=8)
ax3.set_xlabel('Total Messages', color='#8b949e', fontsize=9)
ax3.set_title('Messages by Region', color='white', fontsize=11, fontweight='bold', pad=8)
ax3.tick_params(colors='#8b949e', labelsize=9)
for spine in ax3.spines.values(): spine.set_color('#2d3142')
ax3.set_xlim(0, df['total_messages'].max() * 1.2)
ax3.invert_yaxis()

# 4 - Stacked feature bar by known region
ax4 = fig.add_axes([0.04, 0.08, 0.56, 0.42])
ax4.set_facecolor('#1a1d27')
xk = np.arange(len(df_known))
bottom = np.zeros(len(df_known))
for col, label, color in zip(feature_cols, feature_labels, feat_colors):
    vals = df_known[col].values.astype(float)
    ax4.bar(xk, vals, bottom=bottom, label=label, color=color,
            edgecolor='#0f1117', linewidth=0.5, width=0.55)
    for j, (b, v) in enumerate(zip(bottom, vals)):
        if v > 5:
            ax4.text(xk[j], b + v/2, str(int(v)), ha='center', va='center',
                     color='white', fontsize=8, fontweight='bold')
    bottom += vals
ax4.set_xticks(xk)
ax4.set_xticklabels(df_known['region'], color='#8b949e', fontsize=11)
ax4.set_ylabel('Completed Uses', color='#8b949e', fontsize=9)
ax4.set_title('Feature Breakdown by Region (Pakistan)', color='white', fontsize=11, fontweight='bold', pad=8)
ax4.tick_params(colors='#8b949e')
for spine in ax4.spines.values(): spine.set_color('#2d3142')
ax4.legend(loc='upper right', fontsize=8, frameon=False, labelcolor='#8b949e')

# 5 - Feature heatmap-style per region
ax5 = fig.add_axes([0.68, 0.08, 0.27, 0.42])
ax5.set_facecolor('#1a1d27')
heat_data = df_known[feature_cols].values.astype(float)
# normalize per column for color intensity
heat_norm = np.zeros_like(heat_data)
for col_i in range(heat_data.shape[1]):
    mx = heat_data[:, col_i].max()
    if mx > 0:
        heat_norm[:, col_i] = heat_data[:, col_i] / mx

im = ax5.imshow(heat_norm, cmap='YlOrRd', aspect='auto', vmin=0, vmax=1)
ax5.set_xticks(range(len(feature_cols)))
ax5.set_xticklabels(['LP','Coach','Read','Video','Img'], color='#8b949e', fontsize=8)
ax5.set_yticks(range(len(df_known)))
ax5.set_yticklabels(df_known['region'], color='#8b949e', fontsize=9)
ax5.set_title('Feature Intensity\nHeatmap', color='white', fontsize=11, fontweight='bold', pad=8)
ax5.tick_params(colors='#8b949e')
for spine in ax5.spines.values(): spine.set_color('#2d3142')
# add numbers
for i in range(heat_data.shape[0]):
    for j in range(heat_data.shape[1]):
        val = int(heat_data[i, j])
        text_color = 'black' if heat_norm[i, j] > 0.5 else 'white'
        ax5.text(j, i, str(val), ha='center', va='center', color=text_color, fontsize=9, fontweight='bold')

fig.text(0.5, 0.97, 'Pakistan Regional Analysis — Rumi Platform', ha='center',
         fontsize=15, fontweight='bold', color='white')
fig.text(0.5, 0.945, 'User distribution, engagement & feature adoption by province',
         ha='center', fontsize=10, color='#8b949e')

plt.savefig('rumi_pakistan_regions.png', dpi=150, bbox_inches='tight',
            facecolor=fig.get_facecolor())
print("Saved: rumi_pakistan_regions.png")
