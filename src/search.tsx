import React, { useState, useEffect, ReactNode } from 'react'
import { useInput, Text, Box } from 'ink'
import { Fzf } from 'fzf'
import { Logger } from './utils/log.js'
import { Todo, TodoStatus } from './utils/todo.js'
import { TodoManager } from './utils/todo-manager.js'

export default function Search({
  todos,
  onSelectedChanged,
}: {
  todos: Todo[]
  onSelectedChanged: any
}): JSX.Element {
  const fzf = new Fzf(
    todos
      // .sort((a, b) => b.getCreatedOn().getTime() - a.getCreatedOn().getTime())
      .map((item) => item.getTitle()),
    { sort: false },
  )
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
    setResults(fzf.find(query))
    setSelectedIndex(0)
  }, [query])

  useInput((input, key) => {
    Logger.info(
      `useInput, input: ${input} key: ${JSON.stringify(key, undefined, 2)}`,
    )
    if (key.shift) {
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
      Logger.info(`####current todo: ${JSON.stringify(currentTodo)}`)
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
    onSelectedChanged(todos[selectedIndex])
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
