const KNOWN_ERROR_PATTERNS: ReadonlyArray<{
  test: (message: string) => boolean;
  friendly: string;
}> = [
  {
    test: (message) =>
      message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch'),
    friendly:
      'Unable to reach the blockchain network. Please check your connection and try again.',
  },
  {
    test: (message) =>
      message.toLowerCase().includes('not found') ||
      message.toLowerCase().includes('willnotfound') ||
      message.toLowerCase().includes('no such will'),
    friendly: 'This will was not found on the blockchain.',
  },
  {
    test: (message) => message.toLowerCase().includes('simulation'),
    friendly:
      'The transaction simulation failed. The will may no longer be in a state that allows this action.',
  },
  {
    test: (message) =>
      message.toLowerCase().includes('insufficient') ||
      message.toLowerCase().includes('balance'),
    friendly: 'There are not enough funds to complete this operation.',
  },
  {
    test: (message) =>
      message.toLowerCase().includes('already voted') ||
      message.toLowerCase().includes('not a guardian') ||
      message.toLowerCase().includes('not guardian'),
    friendly:
      'You are not eligible to perform this action on this will.',
  },
  {
    test: (message) => message.toLowerCase().includes('unauthorized'),
    friendly:
      'You do not have permission to perform this action.',
  },
  {
    test: (message) =>
      message.toLowerCase().includes('contract') &&
      message.toLowerCase().includes('not found'),
    friendly: 'The smart contract could not be found on the network.',
  },
];

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    for (const pattern of KNOWN_ERROR_PATTERNS) {
      if (pattern.test(error.message)) {
        return pattern.friendly;
      }
    }
  }
  return 'Something went wrong. Please try again later.';
}
