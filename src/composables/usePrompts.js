const loadPrompts = async () => {
  try {
    const response = await fetch('./awesome_prompts.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load prompts:', error)
    throw error
  }
} 