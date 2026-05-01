import * as React from "react"
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../../apis/todos"
import type { Todo, TodoPayload } from "../../types/todo.types"
import { DialogDemo } from "../layouts/TodoAdd"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Textarea } from "./textarea"

const getTodoId = (todo: Todo) => todo._id ?? todo.id ?? ""

const extractTodo = (payload: unknown): Todo | null => {
    if (!payload || typeof payload !== "object") {
        return null
    }

    if ("_id" in payload || "id" in payload) {
        return payload as Todo
    }

    if ("todo" in payload) {
        return ((payload as { todo?: Todo }).todo ?? null) as Todo | null
    }

    return null
}

const Todos = () => {
    const [todos, setTodos] = React.useState<Todo[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const loadTodos = React.useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetchTodos()
            const list = Array.isArray(response.data)
                ? response.data
                : response.data?.todos ?? []
            setTodos(list)
        } catch (loadError) {
            setError("Failed to load todos. Please refresh.")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        void loadTodos()
    }, [loadTodos])

    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editTitle, setEditTitle] = React.useState("")
    const [editDescription, setEditDescription] = React.useState("")
    const [savingId, setSavingId] = React.useState<string | null>(null)
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    const handleCreate = async (payload: TodoPayload) => {
        setError(null)
        const response = await createTodo(payload)
        const created = extractTodo(response.data ?? response)

        if (created) {
            setTodos((prev) => [created, ...prev])
            return
        }

        setError("Todo created, but could not parse the response.")
    }

    const startEdit = (todo: Todo) => {
        const todoId = getTodoId(todo)
        if (!todoId) {
            return
        }

        setEditingId(todoId)
        setEditTitle(todo.title)
        setEditDescription(todo.description ?? "")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle("")
        setEditDescription("")
    }

    const handleUpdate = async (id: string) => {
        if (!id) {
            return
        }

        const trimmedTitle = editTitle.trim()
        const trimmedDescription = editDescription.trim()

        if (!trimmedTitle) {
            setError("Title is required to update a todo.")
            return
        }

        setSavingId(id)
        setError(null)

        try {
            const response = await updateTodo(id, {
                title: trimmedTitle,
                description: trimmedDescription || undefined,
            })
            const updated = extractTodo(response.data ?? response)

            if (updated) {
                setTodos((prev) =>
                    prev.map((todo) =>
                        getTodoId(todo) === id ? { ...todo, ...updated } : todo
                    )
                )
            }

            cancelEdit()
        } catch (updateError) {
            setError("Failed to update todo. Please try again.")
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!id) {
            return
        }

        setDeletingId(id)
        setError(null)

        try {
            await deleteTodo(id)
            setTodos((prev) => prev.filter((todo) => getTodoId(todo) !== id))
        } catch (deleteError) {
            setError("Failed to delete todo. Please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            <DialogDemo onCreate={handleCreate} />
            <Card>
                <CardHeader>
                    <CardTitle>Your todo</CardTitle>
                    {!loading && todos.length === 0 && (
                        <CardDescription>
                            No todo yet, please click the add todo to have your first todo appeared here..
                        </CardDescription>
                    )}
                    {loading && <CardDescription>Loading todos...</CardDescription>}
                    {error && <CardDescription className="text-destructive">{error}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {loading || todos.length === 0 ? null : (
                        <div className="flex flex-col gap-3">
                            {todos.map((todo) => {
                                const todoId = getTodoId(todo)
                                const isEditing = editingId === todoId
                                const actionDisabled = !todoId

                                return (
                                    <div
                                        key={todoId || todo.title}
                                        className="rounded-lg border border-border/60 bg-background p-3"
                                    >
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    value={editTitle}
                                                    onChange={(event) => setEditTitle(event.target.value)}
                                                    placeholder="Todo title"
                                                />
                                                <Textarea
                                                    value={editDescription}
                                                    onChange={(event) => setEditDescription(event.target.value)}
                                                    placeholder="Todo description"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={cancelEdit}
                                                        disabled={savingId === todoId}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdate(todoId)}
                                                        disabled={savingId === todoId}
                                                    >
                                                        {savingId === todoId ? "Saving..." : "Save"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-base font-medium">{todo.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {todo.description || "No description"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEdit(todo)}
                                                        disabled={actionDisabled}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(todoId)}
                                                        disabled={deletingId === todoId || actionDisabled}
                                                    >
                                                        {deletingId === todoId ? "Deleting..." : "Delete"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Todos