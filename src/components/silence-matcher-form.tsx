import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Plus, X } from "lucide-react"

interface Matcher {
  name: string
  value: string
  isRegex: boolean
  isEqual: boolean
}

interface SilenceMatcherFormProps {
  onNext: (matchers: Matcher[], comment: string, createdby: string) => void
}

export function SilenceMatcherForm({ onNext }: SilenceMatcherFormProps) {
  const [matchers, setMatchers] = useState<Matcher[]>([
    { name: "", value: "", isRegex: false, isEqual: true }
  ])
  const [comment, setComment] = useState("")
  const [createdby, setCreatedby] = useState("")

  // Validation function: allows only letters and underscores
  const isValidMatcherName = (name: string) => /^[A-Za-z_]+$/.test(name)

  const addMatcher = () => {
    setMatchers([...matchers, { name: "", value: "", isRegex: false, isEqual: true }])
  }

  const removeMatcher = (index: number) => {
    setMatchers(matchers.filter((_, i) => i !== index))
  }

  const updateMatcher = (index: number, field: keyof Matcher, value: string | boolean) => {
    const updatedMatchers = [...matchers]
    updatedMatchers[index] = { ...updatedMatchers[index], [field]: value } as Matcher
    setMatchers(updatedMatchers)
  }

  // Function to update switches with radio-button behavior
  const updateMatcherSwitches = (index: number, field: 'isRegex' | 'isEqual') => {
    setMatchers(prevMatchers => {
      const updated = [...prevMatchers]
      if (field === 'isRegex') {
        updated[index] = { ...updated[index], isRegex: true, isEqual: false, name: updated[index]?.name ?? "", value: updated[index]?.value ?? "" }
      } else {
        updated[index] = { ...updated[index], isEqual: true, isRegex: false, name: updated[index]?.name ?? "", value: updated[index]?.value ?? "" }
      }
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate all matcher names
    for (const matcher of matchers) {
      if (!isValidMatcherName(matcher.name)) {
        alert("Matcher names must contain only letters and underscores (no numbers or other symbols).")
        return
      }
    }
    onNext(matchers, comment, createdby)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {matchers.map((matcher, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Matcher {index + 1}</h4>
              {index > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeMatcher(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  value={matcher.name}
                  onChange={(e) => updateMatcher(index, "name", e.target.value)}
                  className={`bg-gray-700 ${matcher.name && !isValidMatcherName(matcher.name) ? "border-red-500" : ""}`}
                />
                {matcher.name && !isValidMatcherName(matcher.name) && (
                  <p className="text-red-500 text-sm">
                    Name must contain only letters and underscores.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`value-${index}`}>Value</Label>
                <Input
                  id={`value-${index}`}
                  value={matcher.value}
                  onChange={(e) => updateMatcher(index, "value", e.target.value)}
                  className="bg-gray-700"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`regex-${index}`}
                  checked={matcher.isRegex}
                  onCheckedChange={() => updateMatcherSwitches(index, 'isRegex')}
                />
                <Label htmlFor={`regex-${index}`}>Regex</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`equal-${index}`}
                  checked={matcher.isEqual}
                  onCheckedChange={() => updateMatcherSwitches(index, 'isEqual')}
                />
                <Label htmlFor={`equal-${index}`}>Equal</Label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addMatcher} className="w-full text-black">
        <Plus className="mr-2 h-4 w-4" />
        Add Matcher
      </Button>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-gray-700"
          placeholder="Add a comment for this silence..."
        />
      </div>
      <div>
        <Label htmlFor="createdby">Created by</Label>
        <Textarea
          id="createdby"
          value={createdby}
          onChange={(e) => setCreatedby(e.target.value)}
          className="bg-gray-700"
          placeholder="Who made this silence?"
        />
      </div>
      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  )
}
