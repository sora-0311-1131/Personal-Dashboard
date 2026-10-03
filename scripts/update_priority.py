import re

def update_types():
    with open('src/types/index.ts', 'r') as f:
        content = f.read()
    content = re.sub(r'priority:\s*GoalPriority;', r'priority?: GoalPriority;', content)
    content = re.sub(r'priority:\s*ProjectPriority;', r'priority?: ProjectPriority;', content)
    content = re.sub(r'priority:\s*TaskPriority;', r'priority?: TaskPriority;', content)
    with open('src/types/index.ts', 'w') as f:
        f.write(content)

def update_manager(filepath, entity_name, priority_type):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Update initial states
    # priority: 'P1' -> priority: ''
    content = re.sub(r"priority:\s*'P1'", r"priority: '' as any", content)
    
    # priority: priority_type -> priority: priority_type | ''
    content = re.sub(fr"priority:\s*{priority_type};", fr"priority: {priority_type} | '';", content)
    
    # 2. Update creation logic
    # priority: newEntity.priority, -> priority: newEntity.priority || undefined,
    content = re.sub(fr"priority:\s*new{entity_name}\.priority,", fr"priority: new{entity_name}.priority || undefined,", content)
    
    # 3. Update select options in forms
    # Add <option value="">-- 未設定 --</option> before <option value="P0">
    select_option = r'<option value="">-- 未設定 --</option>\n                <option value="P0">'
    content = re.sub(r'<option value="P0">', select_option, content)
    
    # 4. Update select value casting in onChange
    # e.target.value as priority_type -> e.target.value as (priority_type | '')
    content = re.sub(fr"as\s*{priority_type}\s*\}}", fr"as ({priority_type} | '') }}", content)
    
    # 5. Update sorting logic
    sort_old = r"""      if \(sortBy === 'priority-desc'\) {
        const pOrder = \{ P0: 0, P1: 1, P2: 2 \};
        if \(pOrder\[a\.priority\] !== pOrder\[b\.priority\]\) \{
          return pOrder\[a\.priority\] - pOrder\[b\.priority\];
        \}"""
    sort_new = r"""      if (sortBy === 'priority-desc') {
        const pOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
        const pA = a.priority ? pOrder[a.priority] : 3;
        const pB = b.priority ? pOrder[b.priority] : 3;
        if (pA !== pB) {
          return pA - pB;
        }"""
    
    # Fallback if the regex doesn't strictly match the old one because of typing
    content = re.sub(sort_old, sort_new, content)
    
    # Also handle the one with type assertions if any
    sort_old2 = r"""      if \(sortBy === 'priority-desc'\) \{
        const pOrder: any = \{ P0: 0, P1: 1, P2: 2 \};
        if \(pOrder\[a\.priority\] !== pOrder\[b\.priority\]\) \{
          return pOrder\[a\.priority\] - pOrder\[b\.priority\];
        \}"""
    content = re.sub(sort_old2, sort_new, content)

    # Note: For GoalManager, ProjectManager, TaskManager
    # Let's just do a string replace for the exact sort logic since it's identical
    exact_old = """      if (sortBy === 'priority-desc') {
        const pOrder = { P0: 0, P1: 1, P2: 2 };
        if (pOrder[a.priority] !== pOrder[b.priority]) {
          return pOrder[a.priority] - pOrder[b.priority];
        }"""
    exact_new = """      if (sortBy === 'priority-desc') {
        const pOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
        const pA = a.priority ? pOrder[a.priority] : 3;
        const pB = b.priority ? pOrder[b.priority] : 3;
        if (pA !== pB) {
          return pA - pB;
        }"""
    content = content.replace(exact_old, exact_new)

    # In editing, editingData.priority could be undefined
    # We should allow empty string
    content = content.replace("value={editing" + entity_name + "Data.priority}", "value={editing" + entity_name + "Data.priority || ''}")

    # Remove any extra empty options if we accidentally added multiple
    content = content.replace('<option value="">-- 未設定 --</option>\n                <option value="">-- 未設定 --</option>', '<option value="">-- 未設定 --</option>')

    with open(filepath, 'w') as f:
        f.write(content)

update_types()
update_manager('src/components/GoalManager.tsx', 'Goal', 'GoalPriority')
update_manager('src/components/ProjectManager.tsx', 'Project', 'ProjectPriority')
update_manager('src/components/TaskManager.tsx', 'Task', 'TaskPriority')

print("Done")
