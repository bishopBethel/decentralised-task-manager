import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { PlusCircle, User, DollarSign, Mail, X, Check, AlertCircle, Trash2 } from 'lucide-react';
import './app.css';

const initialColumns = {
  todo: {
    title: 'To Do',
    items: [
      { 
        id: '1', 
        content: 'Design new landing page',
        assignee: null,
        bounty: null,
        email: null,
        status: 'unassigned',
        bountyUpdateRequested: false
      }
    ]
  },
  inProgress: {
    title: 'In Progress',
    items: []
  },
  done: {
    title: 'Done',
    items: []
  }
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingToColumn, setAddingToColumn] = useState(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId) => {
    if (!draggedItem) return;

    const sourceColumn = Object.keys(columns).find(
      colId => columns[colId].items.some(item => item.id === draggedItem.id)
    );

    if (sourceColumn === columnId) return;

    setColumns(prev => ({
      ...prev,
      [sourceColumn]: {
        ...prev[sourceColumn],
        items: prev[sourceColumn].items.filter(item => item.id !== draggedItem.id)
      },
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, draggedItem]
      }
    }));
    setDraggedItem(null);
  };

  const assignTask = (taskId, columnId) => {
    if (!assignEmail || !bountyAmount) return;

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map(item => 
          item.id === taskId 
            ? { 
                ...item, 
                assignee: assignEmail, 
                bounty: parseFloat(bountyAmount),
                status: 'pending_acceptance'
              }
            : item
        )
      }
    }));
    
    setAssignEmail('');
    setBountyAmount('');
    setEditingTask(null);
  };

  const acceptTask = (taskId) => {
    const sourceColumn = Object.keys(columns).find(
      colId => columns[colId].items.some(item => item.id === taskId)
    );

    const task = columns[sourceColumn].items.find(item => item.id === taskId);
    const updatedTask = { ...task, status: 'accepted' };

    setColumns(prev => ({
      ...prev,
      [sourceColumn]: {
        ...prev[sourceColumn],
        items: prev[sourceColumn].items.filter(item => item.id !== taskId)
      },
      inProgress: {
        ...prev.inProgress,
        items: [...prev.inProgress.items, updatedTask]
      }
    }));
  };

  const requestBountyUpdate = (taskId, columnId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map(item => 
          item.id === taskId 
            ? { ...item, bountyUpdateRequested: true }
            : item
        )
      }
    }));
  };

  const deleteTask = (taskId, columnId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter(item => item.id !== taskId)
      }
    }));
  };

  const addNewTask = (columnId) => {
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      content: newTaskText.trim(),
      assignee: null,
      bounty: null,
      status: 'unassigned',
      bountyUpdateRequested: false
    };

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, newTask]
      }
    }));

    setNewTaskText('');
    setAddingToColumn(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      unassigned: 'text-gray-400',
      pending_acceptance: 'text-yellow-500',
      accepted: 'text-green-500'
    };
    return colors[status] || 'text-gray-400';
  };

  return (
    <div className="kanban-board">
      <h1 className="board-title">Project Board</h1>
      <div className="columns-container">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(columnId)}
          >
            <Card className="column-card">
              <CardHeader className="column-header">
                <div className="header-content">
                  <h2 className="column-title">{column.title}</h2>
                  <div className="header-actions">
                    <span className="item-count">{column.items.length}</span>
                    <button
                      onClick={() => setAddingToColumn(columnId)}
                      className="add-button"
                    >
                      <PlusCircle className="w-5 h-5 text-orange-500" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="column-content">
                {addingToColumn === columnId && (
                  <div className="new-task-form">
                    <textarea
                      className="task-input"
                      placeholder="Enter task description..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      rows={2}
                    />
                    <div className="form-actions">
                      <button
                        onClick={() => setAddingToColumn(null)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => addNewTask(columnId)}
                        className="add-task-button"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                <div className="tasks-container">
                  {column.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      className="task-card"
                    >
                      <div className="task-header">
                        <p className="task-content">{item.content}</p>
                        {item.status === 'unassigned' && (
                          <button
                            onClick={() => deleteTask(item.id, columnId)}
                            className="delete-button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="task-status">
                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                          {item.status === 'pending_acceptance' && <AlertCircle className="w-4 h-4" />}
                          {item.status === 'accepted' && <Check className="w-4 h-4" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>

                      {item.assignee && (
                        <div className="assignee-info">
                          <User className="w-4 h-4" />
                          <span>{item.assignee}</span>
                        </div>
                      )}

                      {item.bounty && (
                        <div className="bounty-container">
                          <div className="bounty-info">
                            <DollarSign className="w-4 h-4" />
                            <span>{item.bounty} USDC</span>
                          </div>
                          {item.status === 'pending_acceptance' && (
                            <button
                              onClick={() => requestBountyUpdate(item.id, columnId)}
                              className="update-bounty-button"
                            >
                              Request Update
                            </button>
                          )}
                        </div>
                      )}

                      {item.bountyUpdateRequested && (
                        <div className="update-requested">
                          <AlertCircle className="w-4 h-4" />
                          Bounty update requested
                        </div>
                      )}

                      {editingTask === item.id ? (
                        <div className="edit-form">
                          <input
                            type="email"
                            placeholder="Assignee email"
                            value={assignEmail}
                            onChange={(e) => setAssignEmail(e.target.value)}
                            className="email-input"
                          />
                          <input
                            type="number"
                            placeholder="Bounty (USDC)"
                            value={bountyAmount}
                            onChange={(e) => setBountyAmount(e.target.value)}
                            className="bounty-input"
                          />
                          <div className="edit-actions">
                            <button
                              onClick={() => setEditingTask(null)}
                              className="cancel-edit-button"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => assignTask(item.id, columnId)}
                              className="assign-button"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      ) : (
                        !item.assignee && (
                          <button
                            onClick={() => setEditingTask(item.id)}
                            className="assign-task-button"
                          >
                            <Mail className="w-4 h-4" />
                            Assign Task
                          </button>
                        )
                      )}

                      {item.status === 'pending_acceptance' && (
                        <button
                          onClick={() => acceptTask(item.id)}
                          className="accept-button"
                        >
                          Accept Task
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;