import re

files = [
    ('src/components/GoalManager.tsx', 'GoalPriority'),
    ('src/components/ProjectManager.tsx', 'ProjectPriority'),
    ('src/components/TaskManager.tsx', 'TaskPriority')
]

for filepath, priority_type in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # The exact regex search to catch any variation
    # priority: (e.target.value || undefined) as TaskPriority | undefined
    pattern = r"priority:\s*\(e\.target\.value\s*\|\|\s*undefined\)\s*as\s*" + priority_type + r"\s*\|\s*undefined"
    
    # We want to replace it only for the newEntity handler which has `...new[Entity]`
    def replacement(match):
        return f"priority: e.target.value as ({priority_type} | '')"
        
    # First we fix everything back to (Priority | '')
    content = re.sub(pattern, replacement, content)
    
    # Then we ONLY change the editingData ones back to undefined
    # editingData has `...editing[Entity]Data`
    edit_pattern = r"(\.\.\.editing\w+Data,\s*priority:\s*e\.target\.value\s*as\s*\(\w+Priority\s*\|\s*''\))"
    def edit_replacement(match):
        full_match = match.group(1)
        # e.target.value as (Priority | '') -> (e.target.value || undefined) as Priority | undefined
        return full_match.replace(f"e.target.value as ({priority_type} | '')", f"(e.target.value || undefined) as {priority_type} | undefined")
        
    content = re.sub(edit_pattern, edit_replacement, content)

    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
