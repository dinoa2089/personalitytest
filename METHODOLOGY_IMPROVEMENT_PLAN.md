# PRISM-7 Assessment Methodology Improvement Plan

## Executive Summary

A comprehensive audit of the PRISM-7 assessment system revealed **critical systemic issues** with framework coverage that explain why MBTI and Enneagram determinations are unreliable.

### Root Cause
**The production database questions have ZERO MBTI and Enneagram framework tags**, while the codebase (`mock-questions.ts`) contains 79 MBTI tags and 70 Enneagram tags that never made it to production.

---

## Audit Findings

### 1. Question Bank Statistics

| Metric | Count |
|--------|-------|
| Total Questions | 316 |
| PRISM Tags | 316 (100%) |
| MBTI Tags | **0 (0%)** ❌ |
| Enneagram Tags | **0 (0%)** ❌ |

### 2. Questions by PRISM Dimension

| Dimension | Count | Status |
|-----------|-------|--------|
| Openness | 58 | ✅ Good |
| Conscientiousness | 58 | ✅ Good |
| Agreeableness | 53 | ✅ Good |
| Extraversion | 48 | ✅ Good |
| Emotional Resilience | 33 | ⚠️ Low |
| Honesty-Humility | 33 | ⚠️ Low |
| Adaptability | 33 | ⚠️ Low |

### 3. Algorithm Design (Good) vs Data (Missing)

The question selection algorithm in `question-selection.ts` is well-designed with:
- Minimum coverage constraints per MBTI dimension
- Minimum coverage constraints per Enneagram type
- Reverse-score ratio balancing
- Weighted random selection by discrimination

**BUT** these features are useless because the database has no MBTI/Enneagram tags to query.

---

## Critical Issues Identified

### Issue 1: Missing Framework Tags (CRITICAL)

**Problem**: Production database questions only have `prism_*` tags. The rich MBTI and Enneagram tags in `mock-questions.ts` were never synced.

**Impact**: 
- MBTI typing is 100% inferred from PRISM dimensions
- Enneagram typing is 100% inferred from PRISM dimensions
- The J/P dimension relies on Conscientiousness (favors ISTJ over ENTJ)
- Type 3 (Achiever) is tied to Conscientiousness (misses achievement/image focus)

**Solution**: Run `node scripts/sync-framework-tags-to-db.js` to sync tags.

### Issue 2: PRISM → MBTI Mapping Flaws

| MBTI Dimension | Current Mapping | Problem |
|----------------|-----------------|---------|
| E/I | Extraversion direct | ✅ Works well |
| S/N | Openness inverted | ⚠️ Incomplete (misses detail-focus) |
| T/F | Agreeableness inverted | ❌ Incomplete (misses logical reasoning) |
| J/P | 60% Conscientiousness + 40% Adaptability | ❌ Favors methodical J, misses decisive J |

### Issue 3: PRISM → Enneagram Mapping Flaws

| Type | Current Mapping | Problem |
|------|-----------------|---------|
| Type 3 | Conscientiousness | ❌ Should be achievement/success orientation |
| Type 8 | Extraversion + Agreeableness(inv) | ⚠️ Missing assertiveness/control |
| Type 7 | Extraversion + Openness + Adaptability | Over-indexed (12 questions vs 8 for Type 3) |

### Issue 4: No Confidence Thresholds

**Problem**: System displays MBTI/Enneagram results even with insufficient data.

**Solution**: Only display framework results when minimum direct questions are answered.

---

## Recommended Fixes

### Phase 1: Immediate (Sync Data)

1. **Sync Framework Tags to Database**
   ```bash
   cd frontend
   node scripts/sync-framework-tags-to-db.js
   ```

2. **Verify Sync Completed**
   ```bash
   node scripts/comprehensive-assessment-audit.js
   ```

### Phase 2: Short-Term (Improve Coverage)

1. **Add Direct MBTI Questions** (10+ per dimension)
   - J/P: Add questions about decisiveness, not just organization
   - T/F: Add questions about logical reasoning, not just agreeableness
   - S/N: Add questions about detail-focus vs big-picture

2. **Rebalance Enneagram Questions**
   - Add 5+ Type 3 questions focused on achievement/success/image
   - Add 3+ Type 8 questions focused on assertiveness/control
   - Reduce Type 7 over-representation

3. **Implement Confidence Thresholds**
   - MBTI: Require >= 3 direct questions per dimension before showing type
   - Enneagram: Require >= 2 direct questions per type before showing type
   - Show "Insufficient data" rather than potentially wrong results

### Phase 3: Medium-Term (Algorithm Improvements)

1. **Improve J/P Formula**
   ```javascript
   // Current (favors ISTJ)
   JP = conscientiousness * 0.6 + (100 - adaptability) * 0.4
   
   // Improved (works for all J types)
   JP = directJpScore * 0.4 + 
        conscientiousness * 0.3 + 
        (100 - adaptability) * 0.2 +
        decisiveness * 0.1
   ```

2. **Add Question Quality Tracking**
   - Track which questions best differentiate between types
   - Weight high-discrimination questions higher
   - Remove or improve low-performing questions

3. **A/B Test Framework Mappings**
   - Test alternative PRISM → MBTI mappings
   - Validate against users who know their type

### Phase 4: Long-Term (Methodology Validation)

1. **Collect Validation Data**
   - Ask users if they know their MBTI type
   - Compare our prediction to their known type
   - Track accuracy rates by type

2. **Calibrate Based on Results**
   - Adjust question weights based on discrimination analysis
   - Refine framework mappings based on validation data

3. **Consider Adding Pure Framework Assessments**
   - Optional MBTI-only question set
   - Optional Enneagram-only question set
   - More accurate for users who want specific frameworks

---

## Success Metrics

After implementing fixes, we should see:

| Metric | Current | Target |
|--------|---------|--------|
| MBTI-tagged questions | 0 | 40+ |
| Enneagram-tagged questions | 0 | 50+ |
| Min questions per MBTI dimension | 0 | 10+ |
| Min questions per Enneagram type | 0 | 5+ |
| MBTI accuracy (validated users) | Unknown | 70%+ |
| Enneagram accuracy (validated users) | Unknown | 60%+ |

---

## Files Created/Modified

| File | Purpose |
|------|---------|
| `scripts/comprehensive-assessment-audit.js` | Full methodology audit |
| `scripts/sync-framework-tags-to-db.js` | Sync tags from mock to DB |
| `scripts/audit-summary.json` | Audit results data |
| `METHODOLOGY_IMPROVEMENT_PLAN.md` | This document |

---

## Next Steps

1. [ ] Run `sync-framework-tags-to-db.js` in production
2. [ ] Re-run audit to verify tags are synced
3. [ ] Review and approve new MBTI/Enneagram questions
4. [ ] Add confidence threshold logic to results display
5. [ ] A/B test improved J/P formula
6. [ ] Implement validation tracking

---

*Generated: December 4, 2025*
*Audit triggered by: ENTJ/Type 3 user incorrectly typed as ENTP/Type 7*

