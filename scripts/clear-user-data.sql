-- Clear all test data for user dean@beanstalkconsulting.co
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- First, find the user ID
DO $$
DECLARE
    target_email TEXT := 'dean@beanstalkconsulting.co';
    user_uuid UUID;
    clerk_user_id TEXT;
BEGIN
    -- Find user by email in the users table
    SELECT id, clerk_id INTO user_uuid, clerk_user_id 
    FROM users 
    WHERE email = target_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User not found with email: %', target_email;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user: % (clerk_id: %)', user_uuid, clerk_user_id;
    
    -- Delete assessment responses
    DELETE FROM assessment_responses 
    WHERE session_id IN (
        SELECT id FROM assessment_sessions WHERE user_id = user_uuid
    );
    RAISE NOTICE 'Deleted assessment responses';
    
    -- Delete assessment results
    DELETE FROM assessment_results 
    WHERE session_id IN (
        SELECT id FROM assessment_sessions WHERE user_id = user_uuid
    );
    RAISE NOTICE 'Deleted assessment results';
    
    -- Delete assessment sessions
    DELETE FROM assessment_sessions WHERE user_id = user_uuid;
    RAISE NOTICE 'Deleted assessment sessions';
    
    -- Delete from user_question_history if it exists
    BEGIN
        DELETE FROM user_question_history WHERE user_id = user_uuid::text;
        RAISE NOTICE 'Deleted user question history';
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'user_question_history table does not exist, skipping';
    END;
    
    -- Optionally delete premium unlocks
    BEGIN
        DELETE FROM premium_unlocks WHERE user_id = user_uuid;
        RAISE NOTICE 'Deleted premium unlocks';
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'premium_unlocks table does not exist, skipping';
    END;
    
    RAISE NOTICE 'All test data cleared for user: %', target_email;
END $$;

-- Verify deletion
SELECT 
    'Assessment Sessions' as table_name,
    COUNT(*) as remaining_count
FROM assessment_sessions 
WHERE user_id IN (SELECT id FROM users WHERE email = 'dean@beanstalkconsulting.co')

UNION ALL

SELECT 
    'Assessment Results' as table_name,
    COUNT(*) as remaining_count
FROM assessment_results 
WHERE session_id IN (
    SELECT id FROM assessment_sessions 
    WHERE user_id IN (SELECT id FROM users WHERE email = 'dean@beanstalkconsulting.co')
);


