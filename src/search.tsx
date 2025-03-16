import React, { useState, useEffect, ReactNode } from 'react'
import { useInput, Text, Box } from 'ink'
import { Fzf, FzfResultItem } from 'fzf'
import { Logger } from './utils/log.js'

const items = ['Apple', 'Banana', 'Orange', 'Grapes', 'Watermelon']
const fzf = new Fzf(items, { sort: true })

export default function Search(): JSX.Element {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<FzfResultItem<string>[]>([])

  useEffect(() => {
    setResults(fzf.find(query))
    setSelectedIndex(0)
  }, [query])

  useInput((input, key) => {
    Logger.info(`useInfput, input: ${input} key: ${key}`)
    if (key.return) {
      process.exit(0)
    } else if (key.upArrow) {
      setSelectedIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1))
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1))
    } else if (key.backspace || key.delete) {
      setQuery((prev) => prev.slice(0, -1))
    } else if (!key.ctrl && !key.meta && !key.escape) {
      setQuery((prev) => prev + input)
    }
  })

  return (
    <Box flexDirection="column">
      <Box
        flexDirection="column"
        paddingX={1}
        paddingY={0}
        width="100%"
        borderStyle="bold"
        borderColor="red"
      >
        <Text color="cyan">
          {'🔍'} {query}
        </Text>
      </Box>

      {results.length === 0 ? noResult() : hasResults()}
    </Box>
  )

  function hasResults(): ReactNode {
    Logger.info(`hasResults results: ${JSON.stringify(results, null, 2)}`)
    return results.map(({ item, positions }, index) => (
      <Text
        key={`${item}-${index}`}
        color={index === selectedIndex ? 'green' : 'white'}
      >
        {index === selectedIndex ? '▶ ' : '  '}
        {highlightMatch(item)}
      </Text>
    ))
  }

  function noResult(): ReactNode {
    Logger.info(`noResults`)
    return <Text color="red">No results</Text>
  }

  function highlightMatch(item: string) {
    Logger.info(`highlightMatch item: ${item}}`)
    return item.split('').map((char, index) => (
      <Text
        key={`${item}-${index}`}
        color={
          query.toLowerCase().includes(char.toLowerCase()) ? 'red' : 'white'
        }
      >
        {char}
      </Text>
    ))
  }
}
