import { describe, it, expect } from 'vitest';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dc = require(path.resolve(__dirname, '..', '..', 'scripts', 'damage-control.js'));

const { pathMatchesRule, checkPathList, normalizePath } = dc as {
  pathMatchesRule: (fp: string, rule: string) => boolean;
  checkPathList: (
    filePaths: string[],
    ruleList: string[],
  ) => { matched: boolean; rule?: string; path?: string };
  normalizePath: (p: string) => string;
};

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------
// The previous path-matching used `fp.includes(rule)` and produced false
// positives that caused operator friction (`.env.example`, `.environment`,
// `.envrc`, etc. all matched the `.env` rule). This suite locks down the
// new path-segment-aware semantics so the regression cannot return.
//
// Semantics:
//   * Trailing-slash rule (e.g. `.ssh/`) is a directory rule: matches the
//     directory itself, paths inside it, or interior segments equal to it.
//   * Non-trailing-slash rule (e.g. `.env`) is a file/path-segment rule:
//     matches when the path equals it, ends with it as a final segment,
//     starts with it as the first segment, or contains it as an interior
//     segment — but never when it's only a substring of a longer filename.
// ---------------------------------------------------------------------------

describe('damage-control path-segment matching', () => {
  describe('exports', () => {
    it('exports pathMatchesRule and checkPathList', () => {
      expect(typeof pathMatchesRule).toBe('function');
      expect(typeof checkPathList).toBe('function');
      expect(typeof normalizePath).toBe('function');
    });
  });

  describe('pathMatchesRule — file/segment rules (no trailing slash)', () => {
    it('matches an exact bare filename', () => {
      expect(pathMatchesRule('.env', '.env')).toBe(true);
    });

    it('matches a filename in a relative subdirectory', () => {
      expect(pathMatchesRule('config/.env', '.env')).toBe(true);
      expect(pathMatchesRule('a/b/c/.env', '.env')).toBe(true);
    });

    it('matches a filename in an absolute path', () => {
      expect(pathMatchesRule('/home/u/.env', '.env')).toBe(true);
      expect(pathMatchesRule('C:/Users/me/.env', '.env')).toBe(true);
    });

    it('matches when interior segment equals the rule', () => {
      expect(pathMatchesRule('foo/.env/bar', '.env')).toBe(true);
    });

    it('matches when first segment equals the rule', () => {
      expect(pathMatchesRule('.env/something', '.env')).toBe(true);
    });

    it('does NOT match a filename that merely starts with the rule', () => {
      // The original false positives that prompted Fix 3.
      expect(pathMatchesRule('.env.example', '.env')).toBe(false);
      expect(pathMatchesRule('.env.local', '.env')).toBe(false);
      expect(pathMatchesRule('.env.production', '.env')).toBe(false);
      expect(pathMatchesRule('config/.env.example', '.env')).toBe(false);
      expect(pathMatchesRule('/home/u/.env.test', '.env')).toBe(false);
    });

    it('does NOT match a filename that contains the rule as a substring', () => {
      expect(pathMatchesRule('.environment', '.env')).toBe(false);
      expect(pathMatchesRule('.envrc', '.env')).toBe(false);
      expect(pathMatchesRule('my-.envrc', '.env')).toBe(false);
      expect(pathMatchesRule('weird.env.bak', '.env')).toBe(false);
      expect(pathMatchesRule('.envoyconfig', '.env')).toBe(false);
    });

    it('does NOT match siblings whose name starts the same way', () => {
      expect(pathMatchesRule('.gitignore', '.git')).toBe(false);
      expect(pathMatchesRule('.gitmodules', '.git')).toBe(false);
      expect(pathMatchesRule('.gitattributes', '.git')).toBe(false);
    });

    it('handles interior multi-segment rules like .aws/credentials', () => {
      expect(pathMatchesRule('.aws/credentials', '.aws/credentials')).toBe(true);
      expect(pathMatchesRule('/home/u/.aws/credentials', '.aws/credentials')).toBe(true);
      expect(pathMatchesRule('/home/u/.aws/credentials.bak', '.aws/credentials')).toBe(false);
    });

    it('normalizes Windows backslashes', () => {
      expect(pathMatchesRule('C:\\Users\\me\\.env', '.env')).toBe(true);
      expect(pathMatchesRule('C:\\Users\\me\\.env.example', '.env')).toBe(false);
    });
  });

  describe('pathMatchesRule — directory rules (trailing slash)', () => {
    it('matches when the path equals the directory', () => {
      expect(pathMatchesRule('.ssh', '.ssh/')).toBe(true);
      expect(pathMatchesRule('home/u/.ssh', '.ssh/')).toBe(true);
    });

    it('matches files inside the directory', () => {
      expect(pathMatchesRule('.ssh/id_rsa', '.ssh/')).toBe(true);
      expect(pathMatchesRule('home/u/.ssh/config', '.ssh/')).toBe(true);
      expect(pathMatchesRule('/home/u/.ssh/known_hosts', '.ssh/')).toBe(true);
    });

    it('matches when directory appears as interior segment', () => {
      expect(pathMatchesRule('a/.ssh/b/c', '.ssh/')).toBe(true);
    });

    it('does NOT match siblings whose name starts the same way', () => {
      expect(pathMatchesRule('.sshconfig', '.ssh/')).toBe(false);
      expect(pathMatchesRule('myssh', '.ssh/')).toBe(false);
      expect(pathMatchesRule('myssh/foo', '.ssh/')).toBe(false);
    });

    it('does NOT match .gitignore against .git/ rule', () => {
      expect(pathMatchesRule('.gitignore', '.git/')).toBe(false);
      expect(pathMatchesRule('.gitmodules', '.git/')).toBe(false);
      expect(pathMatchesRule('home/.gitignore', '.git/')).toBe(false);
    });

    it('matches inside .git/ directory', () => {
      expect(pathMatchesRule('.git/config', '.git/')).toBe(true);
      expect(pathMatchesRule('.git/HEAD', '.git/')).toBe(true);
      expect(pathMatchesRule('repo/.git/objects/abc', '.git/')).toBe(true);
    });
  });

  describe('pathMatchesRule — degenerate inputs', () => {
    it('returns false for empty path', () => {
      expect(pathMatchesRule('', '.env')).toBe(false);
    });

    it('returns false for empty rule', () => {
      expect(pathMatchesRule('.env', '')).toBe(false);
    });

    it('returns false for nullish inputs', () => {
      // @ts-expect-error testing runtime guard
      expect(pathMatchesRule(null, '.env')).toBe(false);
      // @ts-expect-error testing runtime guard
      expect(pathMatchesRule('.env', null)).toBe(false);
      // @ts-expect-error testing runtime guard
      expect(pathMatchesRule(undefined, undefined)).toBe(false);
    });

    it('returns false for a rule that is only a slash', () => {
      expect(pathMatchesRule('/some/path', '/')).toBe(false);
    });
  });

  describe('checkPathList — orchestrator semantics', () => {
    it('returns matched: false when no path matches', () => {
      const r = checkPathList(['src/index.ts', '.env.example'], ['.env', '.ssh/']);
      expect(r.matched).toBe(false);
    });

    it('returns matched: true with the offending path/rule when one matches', () => {
      const r = checkPathList(['.env.example', '.env'], ['.env']);
      expect(r.matched).toBe(true);
      expect(r.path).toBe('.env');
      expect(r.rule).toBe('.env');
    });

    it('does not flag .env.example when only .env is protected', () => {
      const r = checkPathList(['.env.example'], ['.env']);
      expect(r.matched).toBe(false);
    });

    it('does not flag .gitignore when only .git/ is protected', () => {
      const r = checkPathList(['.gitignore', '.gitmodules', '.gitattributes'], ['.git/']);
      expect(r.matched).toBe(false);
    });

    it('still flags real .git/ writes', () => {
      const r = checkPathList(['repo/.git/HEAD'], ['.git/']);
      expect(r.matched).toBe(true);
    });

    it('flags .ssh/id_rsa even with a list of unrelated rules first', () => {
      const r = checkPathList(['.ssh/id_rsa'], ['.env', '.aws/credentials', '.ssh/']);
      expect(r.matched).toBe(true);
      expect(r.rule).toBe('.ssh/');
    });
  });
});
