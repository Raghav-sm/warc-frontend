/**
 * Compares two values based on a specified condition
 * @param fieldValue The value from the form state
 * @param condition The comparison operator ('===', '!==', '>', '<', '>=', '<=')
 * @param compareValue The value to compare against
 * @returns Boolean result of the comparison
 */
export function compareValues(fieldValue: unknown, condition: string, compareValue: unknown): boolean {
  const fieldStr = String(fieldValue);
  const compareStr = String(compareValue);

  // Convert to numbers for numeric comparisons
  const numFieldValue = !Number.isNaN(Number(fieldValue)) ? Number(fieldValue) : fieldValue;
  const numCompareValue = !Number.isNaN(Number(compareValue)) ? Number(compareValue) : compareValue;

  switch (condition) {
    case "===":
      return fieldStr === compareStr;
    case "!==":
      return fieldStr !== compareStr;
    case ">":
      return (numFieldValue as number) > (numCompareValue as number);
    case "<":
      return (numFieldValue as number) < (numCompareValue as number);
    case ">=":
      return (numFieldValue as number) >= (numCompareValue as number);
    case "<=":
      return (numFieldValue as number) <= (numCompareValue as number);
    default:
      return false;
  }
}
