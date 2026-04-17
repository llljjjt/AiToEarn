# Write Tool Failure - Diagnosis Pattern

## Incident
2026-04-16: Multiple consecutive Write tool failures without proper diagnosis

## Root Cause
- Working directory was `e:\小红书分发\AiToEarn-main\` (parent dir)
- Actual project was in `AiToEarn-main\` subdirectory
- Write tool failed silently with "Write failed" - no detailed error message

## What Went Wrong
1. **Blind retry**: Kept retrying Write with different parameters instead of diagnosing environment
2. **No environment check**: Didn't verify `pwd` or target directory existence
3. **Assumed wrong problem**: Thought it was parameter issue, not path issue

## Correct Response Pattern
When ANY tool fails 2+ times consecutively:

```bash
# STOP and diagnose:
pwd                          # Where am I?
ls -la                       # What's here?
ls -la <target_dir>         # Does target exist?
realpath <target_file>      # What's the full path?
```

## Prevention
- **First failure**: Check error message carefully
- **Second failure**: Run diagnostic commands before retry
- **Never blind retry 3+ times**: Always diagnose after 2 failures

## Why This Matters
- Wasted 5+ tool calls on blind retries
- User had to intervene to point out the obvious
- Simple `pwd` would have revealed the issue immediately

## Pattern to Remember
**"Two strikes, then diagnose"** - After 2 failures of the same operation, ALWAYS check environment before retry #3
