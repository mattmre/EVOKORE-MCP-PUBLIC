#!/usr/bin/env node
'use strict';

const path = require('path');
const { requireHookSafely } = require('./fail-safe-loader');

requireHookSafely({
  hookName: 'anti-slop',
  modulePath: path.join(__dirname, '..', 'anti-slop.js'),
});
