import re

files = [
    ('src/components/GoalManager.tsx', 'newGoal', 'GoalPriority'),
    ('src/components/ProjectManager.tsx', 'newProject', 'ProjectPriority'),
    ('src/components/TaskManager.tsx', 'newTask', 'TaskPriority')
]

for filepath, state_name, priority_type in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # The error line is in the newEntity creation form:
    # onChange={e => setNewGoal({ ...newGoal, priority: (e.target.value || undefined) as GoalPriority | undefined })}
    # We want it to be:
    # onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as (GoalPriority | '') })}
    
    old_str = f"set{state_name.capitalize()}({{ ...{state_name}, priority: (e.target.value || undefined) as {priority_type} | undefined }})"
    new_str = f"set{state_name.capitalize()}({{ ...{state_name}, priority: e.target.value as ({priority_type} | '') }})"
    content = content.replace(old_str, new_str)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
