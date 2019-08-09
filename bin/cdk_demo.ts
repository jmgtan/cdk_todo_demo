#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { TodoStack } from '../lib/TodoStack';

const app = new cdk.App();
new TodoStack(app, "TodoStack");
