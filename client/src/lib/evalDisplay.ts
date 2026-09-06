/** Strip embedded evaluation metadata from feedback shown in UI */
export function displayEvalFeedback(feedback?: string | null): string {
  if (!feedback) return '';
  return feedback.split('<!--EVAL_META')[0].trim();
}
