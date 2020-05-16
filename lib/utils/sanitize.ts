export function sanitizeFunctionName(functionName: string): string {
  return functionName
    .split('/')
    .join('')
    .split('-')
    .filter(part => !!part)
    .map(part => {
      const parts = part.split('');
      parts[0] = parts[0].toUpperCase();
      return parts.join('');
    })
    .join('');
}
