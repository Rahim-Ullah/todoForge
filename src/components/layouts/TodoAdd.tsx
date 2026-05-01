import { Plus } from "lucide-react"
import * as React from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import type { TodoPayload } from "../../types/todo.types"



type DialogDemoProps = {
  onCreate: (payload: TodoPayload) => Promise<void>
}

export function DialogDemo({ onCreate }: DialogDemoProps) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setError(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setError("Title is required.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await onCreate({
        title: trimmedTitle,
        description: trimmedDescription || undefined,
      })
      setTitle("")
      setDescription("")
      setOpen(false)
    } catch (submitError) {
      setError("Failed to save todo. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex justify-end w-full ">
        <DialogTrigger asChild>
          <Button variant="outline">Create Todo <Plus /></Button>
        </DialogTrigger>
      </div>
      <DialogContent
        className="sm:max-w-sm"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Todo</DialogTitle>
            <DialogDescription>
              Fill in the details for your new todo.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Title</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Todo title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="textarea-1">Description</Label>
              <Textarea
                id="textarea-1"
                name="description"
                placeholder="Todo description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </FieldGroup>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
