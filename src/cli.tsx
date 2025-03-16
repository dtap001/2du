#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import Home from './home.js'
import { Logger } from './utils/log.js'

Logger.info("################################################")
Logger.info("################################################")
Logger.info('################# 2du start ####################')
Logger.info("################################################")
Logger.info("################################################")
render(<Home />)
