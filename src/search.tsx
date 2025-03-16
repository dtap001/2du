import React, { useState, useEffect, ReactNode } from 'react'
import { useInput, Text, Box } from 'ink'
import { Fzf } from 'fzf'
import { Logger } from './utils/log.js'
import { Todo, TodoStatus } from './utils/todo.js'

export default function Search({
  todos,
  showHiddens,
  showOlderThenOneWeek,
  onSelectedChanged,
}: {
  todos: Todo[]
  showHiddens: boolean
  showOlderThenOneWeek: boolean
  onSelectedChanged: any
}): JSX.Element {
  let fzf = null
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<
    {
      item: string
      start: number
      end: number
      score: number
      positions: {}
    }[]
  >([])

  useEffect(() => {
    fzf = new Fzf(
      todos
        .filter((todo) => todo.getIsHidden() !== showHiddens)
        // .sort((a, b) => b.getCreatedOn().getTime() - a.getCreatedOn().getTime())
        .map((item) => item.getTitle()),
      { sort: false },
    )
    setResults(fzf.find(query))
    setSelectedIndex(0)
  }, [query, todos, showHiddens, showOlderThenOneWeek])

  useEffect(() => {
    onSelectedChanged(todos[selectedIndex])
  }, [setSelectedIndex])

  useInput((input, key) => {
    Logger.info('useInpuit => SEARCH')
    if (input === ' ' && key.shift) {
      Logger.info(
        `change status activate results[selected]: ${JSON.stringify(
          results[selectedIndex],
          undefined,
          2,
        )}`,
      )
      const currentTodo = todos.find(
        (item) => item.getTitle() === results[selectedIndex]!.item,
      )
      currentTodo?.toggleStatus()
      return
    }
    if (key.escape) {
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
    //Logger.info(`hasResults results: ${JSON.stringify(results, null, 2)}`)

    return results.map(({ item }, index) => (
      <Text
        key={`${item}-${index}`}
        color={index === selectedIndex ? 'green' : 'white'}
      >
        {index === selectedIndex ? '▶ ' : '  '}
        {todos.find((todoItem) => todoItem.getTitle() === item)?.getStatus() ===
        TodoStatus.DONE
          ? '[✔] '
          : '[ ] '}
        {todos.find((todoItem) => todoItem.getTitle() === item)?.getIsHidden()
          ? '🥷🏻'
          : ''}
        {highlightMatch(item)}
      </Text>
    ))
  }

  function noResult(): ReactNode {
    Logger.info(`noResults`)
    return <Text color="red">No results</Text>
  }

  function highlightMatch(item: string) {
    //Logger.info(`highlightMatch item: ${item}}`)
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
