import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from sqlalchemy import create_engine

engine = create_engine(
    'postgresql://analyst.jlpenspfdcwxkopaidys:RumiAnalyst2026secure@'
    'aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
)

country_names = {
    '92': 'Pakistan', '94': 'Sri Lanka', '25': 'Ethiopia',
    '97': 'UAE', '44': 'UK', '91': 'India', '49': 'Germany', '12': 'Mexico'
}

df_features = pd.read_sql("""
SELECT
    LEFT(u.phone_number, 2) as country_code,
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
WHERE COALESCE(u.is_test_user, false) = false
GROUP BY LEFT(u.phone_number, 2)
ORDER BY (COUNT(DISTINCT lpr.id) + COUNT(DISTINCT cs.id) + COUNT(DISTINCT ra.id) + COUNT(DISTINCT vr.id) + COUNT(DISTINCT iar.id)) DESC
LIMIT 6
""", engine)

df_features['country'] = df_features['country_code'].map(country_names).fillna(df_features['country_code'])
df_features['total'] = df_features[['lesson_plans','coaching','reading_assessments','videos','image_analysis']].sum(axis=1)

df_totals = pd.read_sql("""
SELECT 'Lesson Plans' as feature, COUNT(*) as total FROM lesson_plan_requests WHERE status = 'completed'
UNION ALL SELECT 'Image Analysis', COUNT(*) FROM image_analysis_requests WHERE status = 'completed'
UNION ALL SELECT 'Reading Assessments', COUNT(*) FROM reading_assessments WHERE status = 'completed'
UNION ALL SELECT 'Coaching', COUNT(*) FROM coaching_sessions WHERE status = 'completed'
UNION ALL SELECT 'Video Generation', COUNT(*) FROM video_requests WHERE status = 'completed'
ORDER BY total DESC
""", engine)

df_users = pd.read_sql("""
SELECT LEFT(u.phone_number, 2) as country_code,
       COUNT(DISTINCT u.id) as total_users,
       COUNT(DISTINCT u.id) FILTER (WHERE u.registration_completed) as registered_users
FROM users u WHERE COALESCE(u.is_test_user, false) = false
GROUP BY LEFT(u.phone_number, 2)
ORDER BY total_users DESC LIMIT 5
""", engine)
df_users['country'] = df_users['country_code'].map(country_names).fillna(df_users['country_code'])

colors = ['#4e9af1','#f97316','#22c55e','#a855f7','#f43f5e']
feature_cols = ['lesson_plans','coaching','reading_assessments','videos','image_analysis']
feature_labels = ['Lesson Plans','Coaching','Reading Assessments','Videos','Image Analysis']

fig = plt.figure(figsize=(18, 13))
fig.patch.set_facecolor('#0f1117')

# 1 - Overall feature usage bar
ax1 = fig.add_axes([0.04, 0.62, 0.28, 0.30])
ax1.set_facecolor('#1a1d27')
bars = ax1.barh(df_totals['feature'], df_totals['total'], color=colors, edgecolor='none', height=0.6)
for bar, val in zip(bars, df_totals['total']):
    ax1.text(bar.get_width() + 30, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', color='white', fontsize=9)
ax1.set_xlabel('Completed Uses', color='#8b949e', fontsize=9)
ax1.set_title('Overall Feature Usage', color='white', fontsize=11, fontweight='bold', pad=8)
ax1.tick_params(colors='#8b949e', labelsize=9)
ax1.spines['top'].set_color('#2d3142')
ax1.spines['right'].set_color('#2d3142')
ax1.spines['bottom'].set_color('#2d3142')
ax1.spines['left'].set_color('#2d3142')
ax1.set_xlim(0, df_totals['total'].max() * 1.2)
ax1.invert_yaxis()

# 2 - Donut chart
ax2 = fig.add_axes([0.36, 0.60, 0.28, 0.36])
ax2.set_facecolor('#0f1117')
wedges, texts, autotexts = ax2.pie(
    df_totals['total'], labels=None, colors=colors,
    autopct=lambda p: f'{p:.1f}%' if p > 3 else '',
    startangle=140, wedgeprops=dict(width=0.55, edgecolor='#0f1117', linewidth=2),
    pctdistance=0.78
)
for at in autotexts:
    at.set_color('white')
    at.set_fontsize(8)
ax2.set_title('Feature Share', color='white', fontsize=11, fontweight='bold')
legend_patches = [mpatches.Patch(color=c, label=l) for c, l in zip(colors, feature_labels)]
ax2.legend(handles=legend_patches, loc='lower center', bbox_to_anchor=(0.5, -0.18),
           ncol=2, fontsize=8, frameon=False, labelcolor='#8b949e')

# 3 - Top countries total bar
ax3 = fig.add_axes([0.68, 0.62, 0.28, 0.30])
ax3.set_facecolor('#1a1d27')
top4 = df_features.head(4)
bars3 = ax3.bar(top4['country'], top4['total'],
                color=['#4e9af1','#f97316','#22c55e','#a855f7'],
                edgecolor='none', width=0.6)
for bar, val in zip(bars3, top4['total']):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
             f'{val:,}', ha='center', color='white', fontsize=9)
ax3.set_title('Total Feature Usage by Region', color='white', fontsize=11, fontweight='bold', pad=8)
ax3.set_ylabel('Completed Uses', color='#8b949e', fontsize=9)
ax3.tick_params(colors='#8b949e', labelsize=9)
ax3.spines['top'].set_color('#2d3142')
ax3.spines['right'].set_color('#2d3142')
ax3.spines['bottom'].set_color('#2d3142')
ax3.spines['left'].set_color('#2d3142')
ax3.set_ylim(0, top4['total'].max() * 1.15)

# 4 - Stacked bar by country
ax4 = fig.add_axes([0.04, 0.15, 0.56, 0.38])
ax4.set_facecolor('#1a1d27')
top4 = df_features.head(4).copy()
x = np.arange(len(top4))
bottom = np.zeros(len(top4))
for col, label, color in zip(feature_cols, feature_labels, colors):
    vals = top4[col].values
    ax4.bar(x, vals, bottom=bottom, label=label, color=color, edgecolor='#0f1117', linewidth=0.5, width=0.55)
    for j, (b, v) in enumerate(zip(bottom, vals)):
        if v > 30:
            ax4.text(x[j], b + v/2, str(int(v)), ha='center', va='center', color='white', fontsize=8, fontweight='bold')
    bottom += vals
ax4.set_xticks(x)
ax4.set_xticklabels(top4['country'], color='#8b949e', fontsize=10)
ax4.set_ylabel('Completed Uses', color='#8b949e', fontsize=9)
ax4.set_title('Feature Breakdown by Region', color='white', fontsize=11, fontweight='bold', pad=8)
ax4.tick_params(colors='#8b949e')
ax4.spines['top'].set_color('#2d3142')
ax4.spines['right'].set_color('#2d3142')
ax4.spines['bottom'].set_color('#2d3142')
ax4.spines['left'].set_color('#2d3142')
ax4.legend(loc='upper right', fontsize=8, frameon=False, labelcolor='#8b949e')

# 5 - Users by country
ax5 = fig.add_axes([0.68, 0.15, 0.28, 0.38])
ax5.set_facecolor('#1a1d27')
df_u5 = df_users.head(5)
x5 = np.arange(len(df_u5))
w = 0.35
ax5.bar(x5 - w/2, df_u5['total_users'], width=w, label='Total Users', color='#4e9af1', edgecolor='none')
ax5.bar(x5 + w/2, df_u5['registered_users'], width=w, label='Registered', color='#22c55e', edgecolor='none')
for xi, (t, r) in enumerate(zip(df_u5['total_users'], df_u5['registered_users'])):
    ax5.text(xi - w/2, t + 10, f'{t:,}', ha='center', color='#4e9af1', fontsize=7)
    ax5.text(xi + w/2, r + 10, f'{r:,}', ha='center', color='#22c55e', fontsize=7)
ax5.set_xticks(x5)
ax5.set_xticklabels(df_u5['country'], color='#8b949e', fontsize=9)
ax5.set_title('Users by Region', color='white', fontsize=11, fontweight='bold', pad=8)
ax5.tick_params(colors='#8b949e')
ax5.spines['top'].set_color('#2d3142')
ax5.spines['right'].set_color('#2d3142')
ax5.spines['bottom'].set_color('#2d3142')
ax5.spines['left'].set_color('#2d3142')
ax5.legend(fontsize=8, frameon=False, labelcolor='#8b949e')

fig.text(0.5, 0.97, 'Rumi Platform - Overall Usage Analysis', ha='center',
         fontsize=16, fontweight='bold', color='white')
fig.text(0.5, 0.945, 'Feature adoption & regional breakdown across all users',
         ha='center', fontsize=11, color='#8b949e')

plt.savefig('rumi_overall_analysis.png', dpi=150, bbox_inches='tight',
            facecolor=fig.get_facecolor())
print("Saved: rumi_overall_analysis.png")
