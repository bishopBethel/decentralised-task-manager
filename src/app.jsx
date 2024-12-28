// Import necessary libraries
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './app.css';

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [
      { id: '1', content: 'Design wireframes' },
      { id: '2', content: 'Set up project repo' },
      { id: '3', content: 'Plan sprint goals' },
    ],
  },
  inProgress: {
    name: 'In Progress',
    items: [
      { id: '4', content: 'Develop login feature' },
    ],
  },
  done: {
    name: 'Done',
    items: [
      { id: '5', content: 'Research competitors' },
    ],
  },
};

function App() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kanban Board</h1>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="kanban-column" key={columnId}>
                <h2>{column.name}</h2>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided) => (
                    <div
                      className="kanban-column-content"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              className="kanban-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;