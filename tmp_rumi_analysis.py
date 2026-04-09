import pandas as pd

path = 'balochistan_march17_37_corrected.csv'
df = pd.read_csv(path)
print('shape', df.shape)
print('columns', list(df.columns))
print('messages_total', int(df['Messages'].sum()))
print('lesson_total', int(df['Lesson_Plans'].sum()))
print('images_total', int(df['Images'].sum()))
print('users_with_messages', int((df['Messages'] > 0).sum()))
print('users_with_lessons', int((df['Lesson_Plans'] > 0).sum()))
print('users_with_images', int((df['Images'] > 0).sum()))
print('status_counts')
print(df['Status'].value_counts().to_dict())
print('top_messages')
print(df.sort_values('Messages', ascending=False).head(10).to_string(index=False))
