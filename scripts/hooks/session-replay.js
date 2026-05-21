#!/usr/bin/env node
'use strict';

const path = require('path');
const { requireHookSafely } = require('./fail-safe-loader');

requireHookSafely({
  hookName: 'session-replay',
  modulePath: path.join(__dirname, '..', 'session-replay.js')
});
