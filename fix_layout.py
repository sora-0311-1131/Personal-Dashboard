import re

files = [
    ('src/components/GoalManager.tsx', 'goal'),
    ('src/components/ProjectManager.tsx', 'project'),
    ('src/components/TaskManager.tsx', 'task')
]

for filepath, entity in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # The exact block to replace
    old_block = f"""                  <div className="flex flex-wrap items-center gap-2">
                    <span className={{`break-words ${{isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100 font-medium'}}`}}>
                      {{{entity}.title}}
                    </span>
                    {{{entity}.priority === 'P0' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}}
                    {{{entity}.priority === 'P1' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}}
                    {{{entity}.priority === 'P2' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}}
                  </div>"""

    new_block = f"""                  <div className="leading-snug break-words">
                    <span className={{`font-medium ${{isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}}`}}>
                      {{{entity}.title}}
                    </span>
                    {{{entity}.priority === 'P0' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}}
                    {{{entity}.priority === 'P1' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}}
                    {{{entity}.priority === 'P2' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}}
                  </div>"""

    content = content.replace(old_block, new_block)

    # In case there's another variation, let's also use regex for safer replacement if exact string fails
    if old_block not in content:
        print(f"Warning: exact block not found in {filepath}. Trying regex.")
        # But wait, earlier I used `sed` to change `block break-all` to `break-words`. So the class might be `break-words `.
        pass

    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
