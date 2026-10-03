import re

files = [
    ('src/components/GoalManager.tsx', 'GoalPriority'),
    ('src/components/ProjectManager.tsx', 'ProjectPriority'),
    ('src/components/TaskManager.tsx', 'TaskPriority')
]

for filepath, priority_type in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # The error line is:
    # onChange={e => setEditingGoalData({ ...editingGoalData, priority: e.target.value as (GoalPriority | '') })}
    
    old_str = f"priority: e.target.value as ({priority_type} | '')"
    new_str = f"priority: (e.target.value || undefined) as {priority_type} | undefined"
    content = content.replace(old_str, new_str)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
