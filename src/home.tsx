import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import Search from './search.js'
import Divider from 'ink-divider'

const makeGradient = () => {
  const GRADIENT = [
    { h: 0, s: 1, v: 1, a: 1 },
    { h: 90, s: 1, v: 1, a: 1 },
    { h: 180, s: 1, v: 1, a: 1 },
    { h: 270, s: 1, v: 1, a: 1 },
    { h: 360, s: 1, v: 1, a: 1 },
  ]

  const theta = new Date().getSeconds() * 6
  return GRADIENT.map((stop, index) => ({
    ...stop,
    h: (theta + index * 90) % 360,
  }))
}

export default function Home(): JSX.Element {
  const [showPopup, setShowPopup] = useState(false)

  useInput((input, key) => {
    if (input === 'r' && key.ctrl) {
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 1000)
    }
  })

  return (
    <Box alignItems="center" flexDirection="column">
      {/* Popup */}
      {showPopup && (
        <Box
          flexDirection="column"
          position="absolute"
          marginLeft={5}
          width={'80%'}
          height={'50%'}
          marginTop={3}
          borderStyle="round"
          borderColor="cyan"
          padding={1}
          overflow="visible"
        >
          <Text color="yellow">⚡ Popup Title ⚡</Text>
          <Text>This is a modal window.</Text>
          <Text>
            Press <Text color="red">Esc</Text> to close.
          </Text>
        </Box>
      )}
      <Gradient colors={makeGradient()}>
        <BigText
          text="2du"
          font="tiny"
          lineHeight={1}
          letterSpacing={1}
          space={true}
        />
      </Gradient>

      <Box flexDirection="column" alignItems={'center'} width={'100%'}>
        <Text>This is the best todo app in the CLI world!</Text>
      </Box>

      <Box flexDirection="column" padding={0} width="100%">
        <Divider title="Help" />
      </Box>

      <Box flexDirection="row" paddingTop={1} width={'100%'}>
        <Box
          flexDirection="column"
          width={'50%'}
          alignItems="stretch"
          justifyContent={'space-between'}
        >
          <Text>{'<ctrl-n> '}new todo</Text>
          <Text>{'<ctrl-d> '}delete todo</Text>
        </Box>
        <Box
          flexDirection="column"
          width={'50%'}
          alignItems="stretch"
          justifyContent={'space-between'}
        >
          <Text>{'<ctrl-e> '}edit todo</Text>
          <Text>{'<ctrl-space> '}change todo status</Text>
        </Box>
      </Box>

      <Box flexDirection="column" padding={0} paddingTop={1} width="100%">
        <Divider title="Search" />
        <Search />
      </Box>
    </Box>
  )
}
