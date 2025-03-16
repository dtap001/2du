#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Home from './home.js';
import { Logger } from './utils/log.js';

Logger.info("################# 2du start ####################")
render(<Home />);
