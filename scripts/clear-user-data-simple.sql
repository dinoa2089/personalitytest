-- SIMPLE VERSION: Clear all test data for dean@beanstalkconsulting.co
-- Run these queries one at a time in Supabase SQL Editor

-- Step 1: Find your user ID (run this first and note the id)
SELECT id, clerk_id, email FROM users WHERE email = 'dean@beanstalkconsulting.co';

-- Step 2: Delete assessment responses (replace USER_ID_HERE with actual UUID from step 1)
DELETE FROM assessment_responses 
WHERE session_id IN (
    SELECT id FROM assessment_sessions 
    WHERE user_id = 'USER_ID_HERE'
);

-- Step 3: Delete assessment results
DELETE FROM assessment_results 
WHERE session_id IN (
    SELECT id FROM assessment_sessions 
    WHERE user_id = 'USER_ID_HERE'
);

-- Step 4: Delete assessment sessions
DELETE FROM assessment_sessions 
WHERE user_id = 'USER_ID_HERE';

-- Step 5: (Optional) Delete question history if table exists
DELETE FROM user_question_history 
WHERE user_id = 'USER_ID_HERE';

-- Step 6: Verify everything is cleared
SELECT 
    (SELECT COUNT(*) FROM assessment_sessions WHERE user_id = 'USER_ID_HERE') as sessions,
    (SELECT COUNT(*) FROM assessment_results WHERE session_id IN (
        SELECT id FROM assessment_sessions WHERE user_id = 'USER_ID_HERE'
    )) as results;


