import { createHash } from 'crypto';

// Simple CAPTCHA generator that creates math problems
export function generateMathProblem() {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1, num2, solution;
  
  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      solution = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 10) + 5; // Ensure positive result
      num2 = Math.floor(Math.random() * 5) + 1;
      solution = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      solution = num1 * num2;
      break;
    default:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      solution = num1 + num2;
  }
  
  const problem = `${num1} ${operation} ${num2}`;
  
  return {
    problem,
    solution: solution.toString()
  };
}

// Encrypt the CAPTCHA solution with a timestamp to prevent reuse
export function encryptCaptchaSolution(solution: string): string {
  const timestamp = Date.now();
  const data = `${solution}:${timestamp}:captcha-secret-key`;
  
  // In a real implementation, you would use a more secure method and proper secret key management
  const hash = createHash('sha256').update(data).digest('hex');
  
  return `${hash}:${timestamp}`;
}

// Verify a submitted CAPTCHA solution against the encrypted token
export function verifyCaptchaSolution(token: string, userSolution: string): boolean {
  if (!token || !userSolution) return false;
  
  const [hash, timestampStr] = token.split(':');
  if (!hash || !timestampStr) return false;
  
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;
  
  // Check if CAPTCHA has expired (5 minute window)
  const now = Date.now();
  if (now - timestamp > 5 * 60 * 1000) return false;
  
  // Recreate the hash with the user's solution
  const expectedData = `${userSolution}:${timestamp}:captcha-secret-key`;
  const expectedHash = createHash('sha256').update(expectedData).digest('hex');
  
  // Compare the hashes
  return hash === expectedHash;
}