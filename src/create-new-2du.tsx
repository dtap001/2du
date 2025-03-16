import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import Search from './search.js'
import Divider from 'ink-divider'
import { Todo } from './utils/todo.js'
import { TextInput } from '@inkjs/ui'
import { TodoManager } from './utils/todo-manager.js'

export default function CreateNew2duComponent({
  todos,
  onSubmit,
}: {
  todos: Todo[]
  onSubmit: any
}): JSX.Element {
  const [value, setValue] = useState('')
  return (
    <Box
      flexDirection="column"
      paddingX={1}
      paddingY={0}
      width="100%"
      borderStyle="bold"
      borderColor="red"
    >
      <Box flexDirection="row">
        <Text>📜 </Text>
        <TextInput
          placeholder="Start typing..."
          onChange={setValue}
          suggestions={todos.map((item) => item.getTitle())}
          onSubmit={(value) => {
            TodoManager.create(value)
            onSubmit()
          }}
        />
      </Box>
    </Box>
  )
}
