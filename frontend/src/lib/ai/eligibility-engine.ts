// ============================================================
// Government Work Helper — Deterministic Eligibility Engine
// TRUST CRITICAL: Eligibility is NEVER decided by the AI.
// ============================================================

import type {
  EligibilityCondition,
  EligibilityGroup,
  EligibilityOperator,
  EligibilityResult,
  EligibilityRule,
  DocumentRequirement,
  ServiceQuestion,
} from "@/types";

function evaluateOperator(fieldValue: unknown, operator: EligibilityOperator, ruleValue: unknown): boolean {
  switch (operator) {
    case "equals": return fieldValue === ruleValue;
    case "not_equals": return fieldValue !== ruleValue;
    case "greater_than": return typeof fieldValue === "number" && typeof ruleValue === "number" && fieldValue > ruleValue;
    case "greater_than_or_equal": return typeof fieldValue === "number" && typeof ruleValue === "number" && fieldValue >= ruleValue;
    case "less_than": return typeof fieldValue === "number" && typeof ruleValue === "number" && fieldValue < ruleValue;
    case "less_than_or_equal": return typeof fieldValue === "number" && typeof ruleValue === "number" && fieldValue <= ruleValue;
    case "in": return Array.isArray(ruleValue) && ruleValue.includes(fieldValue);
    case "not_in": return Array.isArray(ruleValue) && !ruleValue.includes(fieldValue);
    case "exists": return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    case "not_exists": return fieldValue === undefined || fieldValue === null || fieldValue === "";
    case "contains": return typeof fieldValue === "string" && typeof ruleValue === "string" && fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
    case "not_contains": return typeof fieldValue === "string" && typeof ruleValue === "string" && !fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
    default: return false;
  }
}

function isCondition(rule: EligibilityRule): rule is EligibilityCondition { return "field" in rule && "operator" in rule; }
function isGroup(rule: EligibilityRule): rule is EligibilityGroup { return "all" in rule || "any" in rule; }

interface EvalResult { passed: boolean; failedReasons: string[]; missingFields: string[]; passedDescriptions: string[] }

function evaluateRule(rule: EligibilityRule, answers: Record<string, unknown>): EvalResult {
  if (isCondition(rule)) return evaluateCondition(rule, answers);
  if (isGroup(rule)) return evaluateGroup(rule, answers);
  return { passed: false, failedReasons: ["Unknown rule format"], missingFields: [], passedDescriptions: [] };
}

function evaluateCondition(condition: EligibilityCondition, answers: Record<string, unknown>): EvalResult {
  const fieldValue = answers[condition.field];
  if (fieldValue === undefined || fieldValue === null) {
    return { passed: false, failedReasons: [], missingFields: [condition.field], passedDescriptions: [] };
  }
  const passed = evaluateOperator(fieldValue, condition.operator, condition.value);
  return passed
    ? { passed: true, failedReasons: [], missingFields: [], passedDescriptions: [condition.message ?? `${condition.field} ${condition.operator} ${String(condition.value)}`] }
    : { passed: false, failedReasons: [condition.message ?? `${condition.field} does not meet the required condition`], missingFields: [], passedDescriptions: [] };
}

function evaluateGroup(group: EligibilityGroup, answers: Record<string, unknown>): EvalResult {
  const failedReasons: string[] = [];
  const missingFields: string[] = [];
  const passedDescriptions: string[] = [];

  if (group.all) {
    let allPassed = true;
    for (const rule of group.all) {
      const result = evaluateRule(rule, answers);
      passedDescriptions.push(...result.passedDescriptions);
      if (!result.passed) { allPassed = false; failedReasons.push(...result.failedReasons); missingFields.push(...result.missingFields); }
    }
    return { passed: allPassed, failedReasons, missingFields: [...new Set(missingFields)], passedDescriptions };
  }

  if (group.any) {
    let anyPassed = false;
    const allFailed: string[] = []; const allMissing: string[] = [];
    for (const rule of group.any) {
      const result = evaluateRule(rule, answers);
      if (result.passed) { anyPassed = true; passedDescriptions.push(...result.passedDescriptions); }
      else { allFailed.push(...result.failedReasons); allMissing.push(...result.missingFields); }
    }
    return { passed: anyPassed, failedReasons: anyPassed ? [] : allFailed, missingFields: anyPassed ? [] : [...new Set(allMissing)], passedDescriptions };
  }
  return { passed: true, failedReasons: [], missingFields: [], passedDescriptions: [] };
}

export function evaluateEligibility(eligibilityRules: EligibilityRule | null, collectedAnswers: Record<string, unknown>): EligibilityResult {
  if (!eligibilityRules) return { status: "eligible", reasons: [], missing_fields: [], passed_conditions: [] };
  const result = evaluateRule(eligibilityRules, collectedAnswers);
  if (result.missingFields.length > 0 && !result.passed) {
    return { status: "needs_information", reasons: result.failedReasons, missing_fields: result.missingFields, passed_conditions: result.passedDescriptions };
  }
  return { status: result.passed ? "eligible" : "not_eligible", reasons: result.failedReasons, missing_fields: result.missingFields, passed_conditions: result.passedDescriptions };
}

export function getApplicableDocuments(requiredDocs: DocumentRequirement[], conditionalDocs: DocumentRequirement[], collectedAnswers: Record<string, unknown>): DocumentRequirement[] {
  const applicable: DocumentRequirement[] = [...requiredDocs];
  for (const doc of conditionalDocs) {
    if (!doc.required_when) { applicable.push(doc); continue; }
    const fieldValue = collectedAnswers[doc.required_when.field];
    if (fieldValue !== undefined && evaluateOperator(fieldValue, doc.required_when.operator, doc.required_when.value)) applicable.push(doc);
  }
  return applicable;
}

export function getVisibleQuestions(questions: ServiceQuestion[], collectedAnswers: Record<string, unknown>): ServiceQuestion[] {
  return questions.filter((q) => {
    if (!q.show_when) return true;
    const fieldValue = collectedAnswers[q.show_when.field];
    if (fieldValue === undefined || fieldValue === null) return false;
    return evaluateOperator(fieldValue, q.show_when.operator, q.show_when.value);
  });
}

export function getNextQuestion(questions: ServiceQuestion[], collectedAnswers: Record<string, unknown>): ServiceQuestion | null {
  const visible = getVisibleQuestions(questions, collectedAnswers);
  return visible.find((q) => collectedAnswers[q.id] === undefined || collectedAnswers[q.id] === null) ?? null;
}
