import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import Search from './search.js'
import Divider from 'ink-divider'
import { Todo } from './utils/todo.js'
import CreateNew2duComponent from './create-new-2du.js'
import { TodoManager } from './utils/todo-manager.js'
import { Logger } from './utils/log.js'
import { ConfirmInput } from '@inkjs/ui'

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

export default function Home({}: {}): JSX.Element {
  const [todos, setTodos] = useState(TodoManager.get())
  const [showPopup, setShowPopup] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [showAddNewTemplate, setShowAddNewTemplate] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo>()

  useInput((input, key) => {
    if (input === 'r' && key.ctrl) {
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 1000)
    }
    if (input === 'n' && key.ctrl) {
      setShowSearch(false)
      setShowAddNewTemplate(true)
      setShowConfirmDelete(false)
    }
    if (input === 'd' && key.ctrl) {
      setShowSearch(false)
      setShowAddNewTemplate(false)
      setShowConfirmDelete(true)
    }
  })

  useEffect(() => {
    const updateTodos = () => {
      Logger.info('updateTodos called')
      setTodos([...TodoManager.get()])
    }

    TodoManager.setOnUpdate(updateTodos)
    return () => {
      TodoManager.setOnUpdate(() => {})
    }
  }, [])
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
      {showSearch ? searchTemplate() : null}
      {showAddNewTemplate ? addNewTemplate() : null}
      {showConfirmDelete ? confirmDeleteTemplate() : null}
    </Box>
  )

  function confirmDeleteTemplate() {
    return (
      <Box flexDirection="column" padding={0} paddingTop={1} width="100%">
        <Divider title="Delete 2du confirm" />
        <Box flexDirection="column" width={'60%'} alignItems="center">
          <Box
            borderColor="red"
            borderStyle={'bold'}
            flexDirection="column"
            alignItems="center"
            padding={0}
          >
            <Text bold> 🔥 Do you want to delete this todo?</Text>
            <Text> {selectedTodo?.getSummary()}</Text>
            <ConfirmInput
              onConfirm={() => {
                setShowConfirmDelete(false)
                setShowSearch(true)
                setShowAddNewTemplate(false)
                TodoManager.delete(selectedTodo?.getId())
              }}
              onCancel={() => {
                setShowConfirmDelete(false)
                setShowSearch(true)
                setShowAddNewTemplate(false)
              }}
            />
          </Box>
        </Box>
      </Box>
    )
  }

  function addNewTemplate() {
    return (
      <Box flexDirection="column" padding={0} paddingTop={1} width="100%">
        <Divider title="Create new 2du" />
        <CreateNew2duComponent
          todos={todos}
          onSubmit={() => {
            setShowAddNewTemplate(false)
            setShowSearch(true)
            setTodos(TodoManager.get())
          }}
        />
      </Box>
    )
  }

  function searchTemplate() {
    return (
      <Box flexDirection="column" padding={0} paddingTop={1} width="100%">
        <Divider title="Search" />
        <Search
          todos={todos}
          onSelectedChanged={(todo: Todo) => {
            Logger.info('onSelectedChanged is called in search template')
            setSelectedTodo(todo)
          }}
        />
      </Box>
    )
  }
}
