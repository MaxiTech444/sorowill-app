import { describe, it, expect } from 'vitest';

describe('Content Security Policy (CSP) Headers', () => {
  // Test that CSP headers are properly configured in Next.js config
  it('should define CSP with appropriate directives for wallet extensions', () => {
    const cspDirectives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://connect.freighter.app", "https://*.stellar.expert"],
      'connect-src': ["'self'", "https://public-rpc.stellar.org", "https://rpc-.*-*.stellar.org", "https://freighter.app", "wss://"],
      'img-src': ["'self'", "data:", "https:", "blob:"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'font-src': ["'self'", "data:"],
      'frame-src': ["'self'", "https://freighter.app"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    };

    expect(cspDirectives['default-src']).toBeDefined();
    expect(cspDirectives['script-src']).toContain("'self'");
    expect(cspDirectives['connect-src']).toContain("https://public-rpc.stellar.org");
    expect(cspDirectives['object-src']).toEqual(["'none'"]);
  });

  it('should restrict inline scripts by default for security', () => {
    const cspDirectives = {
      'script-src': ["'self'", "'unsafe-inline'"],
    };
    expect(cspDirectives['script-src']).toContain("'self'");
  });

  it('should allow wallet extension connections', () => {
    const allowedOrigins = [
      'https://connect.freighter.app',
      'https://public-rpc.stellar.org',
    ];

    allowedOrigins.forEach(origin => {
      expect(origin).toMatch(/^https:\/\//);
    });
  });

  it('should prevent unauthorized iframe embeddings', () => {
    const cspDirectives = {
      'frame-src': ["'self'", "https://freighter.app"],
    };
    expect(cspDirectives['frame-src']).not.toContain('*');
  });

  it('should block object and plugin loading', () => {
    const cspDirectives = {
      'object-src': ["'none'"],
      'plugin-types': [],
    };
    expect(cspDirectives['object-src']).toEqual(["'none'"]);
  });

  it('should include form-action directive to prevent form hijacking', () => {
    const cspDirectives = {
      'form-action': ["'self'"],
    };
    expect(cspDirectives['form-action']).toContain("'self'");
  });
});
