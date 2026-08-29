// ============================================================
// Government Work Helper — Deterministic Eligibility Engine
//
// TRUST CRITICAL: Eligibility is NEVER decided by the AI.
// This engine evaluates structured JSON rules stored in the DB
// against collected user answers. The AI only explains results.
// ============================================================

import type {
  EligibilityCondition,
  EligibilityGroup,
  EligibilityOperator,
  EligibilityResult,
  EligibilityRule,
} from "../frontend/src/types";

// ─── Operator evaluation ──────────────────────────────────────

function evaluateOperator(
  fieldValue: unknown,
  operator: EligibilityOperator,
  ruleValue: unknown
): boolean {
  switch (operator) {
    case "equals":
      return fieldValue === ruleValue;

    case "not_equals":
      return fieldValue !== ruleValue;

    case "greater_than":
      return typeof fieldValue === "number" &&
        typeof ruleValue === "number" &&
        fieldValue > ruleValue;

    case "greater_than_or_equal":
      return typeof fieldValue === "number" &&
        typeof ruleValue === "number" &&
        fieldValue >= ruleValue;

    case "less_than":
      return typeof fieldValue === "number" &&
        typeof ruleValue === "number" &&
        fieldValue < ruleValue;

    case "less_than_or_equal":
      return typeof fieldValue === "number" &&
        typeof ruleValue === "number" &&
        fieldValue <= ruleValue;

    case "in":
      return Array.isArray(ruleValue) && ruleValue.includes(fieldValue);

    case "not_in":
      return Array.isArray(ruleValue) && !ruleValue.includes(fieldValue);

    case "exists":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";

    case "not_exists":
      return fieldValue === undefined || fieldValue === null || fieldValue === "";

    case "contains":
      return typeof fieldValue === "string" &&
        typeof ruleValue === "string" &&
        fieldValue.toLowerCase().includes(ruleValue.toLowerCase());

    case "not_contains":
      return typeof fieldValue === "string" &&
        typeof ruleValue === "string" &&
        !fieldValue.toLowerCase().includes(ruleValue.toLowerCase());

    default:
      console.warn(`Unknown eligibility operator: ${operator as string}`);
      return false;
  }
}

// ─── Type guards ──────────────────────────────────────────────

function isCondition(rule: EligibilityRule): rule is EligibilityCondition {
  return "field" in rule && "operator" in rule;
}

function isGroup(rule: EligibilityRule): rule is EligibilityGroup {
  return "all" in rule || "any" in rule;
}

// ─── Core recursive evaluator ─────────────────────────────────

interface EvalResult {
  passed: boolean;
  failedReasons: string[];
  missingFields: string[];
  passedDescriptions: string[];
}

function evaluateRule(
  rule: EligibilityRule,
  answers: Record<string, unknown>
): EvalResult {
  if (isCondition(rule)) {
    return evaluateCondition(rule, answers);
  }

  if (isGroup(rule)) {
    return evaluateGroup(rule, answers);
  }

  // Unknown rule shape — treat as needs_information
  return {
    passed: false,
    failedReasons: ["Unknown rule format"],
    missingFields: [],
    passedDescriptions: [],
  };
}

function evaluateCondition(
  condition: EligibilityCondition,
  answers: Record<string, unknown>
): EvalResult {
  const fieldValue = answers[condition.field];

  // Field not yet answered — we need more information
  if (fieldValue === undefined || fieldValue === null) {
    return {
      passed: false,
      failedReasons: [],
      missingFields: [condition.field],
      passedDescriptions: [],
    };
  }

  const passed = evaluateOperator(fieldValue, condition.operator, condition.value);

  if (passed) {
    return {
      passed: true,
      failedReasons: [],
      missingFields: [],
      passedDescriptions: [
        condition.message ?? `${condition.field} ${condition.operator} ${String(condition.value)}`,
      ],
    };
  } else {
    return {
      passed: false,
      failedReasons: [
        condition.message ?? `${condition.field} does not meet the required condition`,
      ],
      missingFields: [],
      passedDescriptions: [],
    };
  }
}

function evaluateGroup(
  group: EligibilityGroup,
  answers: Record<string, unknown>
): EvalResult {
  const failedReasons: string[] = [];
  const missingFields: string[] = [];
  const passedDescriptions: string[] = [];

  if (group.all) {
    // ALL conditions must pass
    let allPassed = true;
    for (const rule of group.all) {
      const result = evaluateRule(rule, answers);
      passedDescriptions.push(...result.passedDescriptions);
      if (!result.passed) {
        allPassed = false;
        failedReasons.push(...result.failedReasons);
        missingFields.push(...result.missingFields);
      }
    }
    return {
      passed: allPassed,
      failedReasons,
      missingFields: [...new Set(missingFields)],
      passedDescriptions,
    };
  }

  if (group.any) {
    // AT LEAST ONE condition must pass
    let anyPassed = false;
    const allFailedReasons: string[] = [];
    const allMissingFields: string[] = [];

    for (const rule of group.any) {
      const result = evaluateRule(rule, answers);
      if (result.passed) {
        anyPassed = true;
        passedDescriptions.push(...result.passedDescriptions);
      } else {
        allFailedReasons.push(...result.failedReasons);
        allMissingFields.push(...result.missingFields);
      }
    }

    return {
      passed: anyPassed,
      failedReasons: anyPassed ? [] : allFailedReasons,
      missingFields: anyPassed ? [] : [...new Set(allMissingFields)],
      passedDescriptions,
    };
  }

  // Empty group — treat as passing
  return { passed: true, failedReasons: [], missingFields: [], passedDescriptions: [] };
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Evaluate eligibility deterministically.
 *
 * @param eligibilityRules  JSON rule stored in the services table
 * @param collectedAnswers  Answers collected from the user so far
 * @returns EligibilityResult — status, reasons, missing fields
 *
 * IMPORTANT: This function must only run server-side.
 * Never send eligibility_rules to the browser.
 */
export function evaluateEligibility(
  eligibilityRules: EligibilityRule | null,
  collectedAnswers: Record<string, unknown>
): EligibilityResult {
  // No rules defined — service is universally eligible
  if (!eligibilityRules) {
    return {
      status: "eligible",
      reasons: [],
      missing_fields: [],
      passed_conditions: [],
    };
  }

  const result = evaluateRule(eligibilityRules, collectedAnswers);

  if (result.missingFields.length > 0 && !result.passed) {
    return {
      status: "needs_information",
      reasons: result.failedReasons,
      missing_fields: result.missingFields,
      passed_conditions: result.passedDescriptions,
    };
  }

  return {
    status: result.passed ? "eligible" : "not_eligible",
    reasons: result.failedReasons,
    missing_fields: result.missingFields,
    passed_conditions: result.passedDescriptions,
  };
}

// ─── Document requirement filter ─────────────────────────────
// Also deterministic — never ask Claude which docs apply.

import type { DocumentRequirement } from "../frontend/src/types";

/**
 * Filter conditional documents based on collected answers.
 * Returns only documents applicable to this user's situation.
 */
export function getApplicableDocuments(
  requiredDocs: DocumentRequirement[],
  conditionalDocs: DocumentRequirement[],
  collectedAnswers: Record<string, unknown>
): DocumentRequirement[] {
  const applicable: DocumentRequirement[] = [...requiredDocs];

  for (const doc of conditionalDocs) {
    if (!doc.required_when) {
      // No condition — always include
      applicable.push(doc);
      continue;
    }

    const condition = doc.required_when;
    const fieldValue = collectedAnswers[condition.field];
    if (fieldValue !== undefined && evaluateOperator(fieldValue, condition.operator, condition.value)) {
      applicable.push(doc);
    }
  }

  return applicable;
}

// ─── Question visibility filter ───────────────────────────────

import type { ServiceQuestion } from "../frontend/src/types";

/**
 * Determine which questions are currently visible based on
 * answers already collected (conditional question logic).
 */
export function getVisibleQuestions(
  questions: ServiceQuestion[],
  collectedAnswers: Record<string, unknown>
): ServiceQuestion[] {
  return questions.filter((q) => {
    if (!q.show_when) return true;
    const { field, operator, value } = q.show_when;
    const fieldValue = collectedAnswers[field];
    if (fieldValue === undefined || fieldValue === null) return false;
    return evaluateOperator(fieldValue, operator, value);
  });
}

/**
 * Get the next unanswered question for a service.
 * Returns null when all required questions are answered.
 */
export function getNextQuestion(
  questions: ServiceQuestion[],
  collectedAnswers: Record<string, unknown>
): ServiceQuestion | null {
  const visible = getVisibleQuestions(questions, collectedAnswers);
  return visible.find((q) => {
    const answered = collectedAnswers[q.id];
    return answered === undefined || answered === null;
  }) ?? null;
}
