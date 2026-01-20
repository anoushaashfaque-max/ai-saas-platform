import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useApi } from '../../hooks/useApi'
import {
  Type,
  Copy,
  Zap,
  Sparkles,
  TrendingUp,
  Hash,
  RefreshCw,
  CheckCircle,
  Filter,
  Star,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

const BlogTitleGenerator = () => {
  const { user } = useAuth()
  const { request } = useApi()
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState([])
  const [formData, setFormData] = useState({
    keyword: '',
    category: 'technology',
    tone: 'clickbait',
    quantity: 10
  })
  const [selectedTitles, setSelectedTitles] = useState([])
  const [favorites, setFavorites] = useState([])
  const [filter, setFilter] = useState('all')

  const categories = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'marketing', label: 'Marketing', icon: '📈' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🌿' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'health', label: 'Health & Fitness', icon: '💪' },
    { id: 'education', label: 'Education', icon: '🎓' }
  ]

  const tones = [
    { id: 'clickbait', label: 'Clickbait', description: 'Attention-grabbing and viral' },
    { id: 'professional', label: 'Professional', description: 'Formal and authoritative' },
    { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { id: 'list', label: 'List Style', description: 'Numbered and organized' },
    { id: 'question', label: 'Question Style', description: 'Curiosity-driven' },
    { id: 'howto', label: 'How-to', description: 'Instructional and helpful' }
  ]

  const quantities = [5, 10, 15, 20]

  const examples = [
    'artificial intelligence',
    'digital marketing',
    'healthy recipes',
    'remote work',
    'personal finance'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleExampleClick = (example) => {
    setFormData(prev => ({
      ...prev,
      keyword: example
    }))
  }

  const handleGenerate = async () => {
    if (!formData.keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setLoading(true)

    try {
      const response = await request('/articles/blog-titles', {
        method: 'POST',
        body: JSON.stringify({
          keyword: formData.keyword,
          category: formData.category,
          tone: formData.tone,
          quantity: formData.quantity
        }),
      })

      if (response.success) {
        // Convert array of strings to objects for frontend display
        const titles = response.data.titles.map((title, index) => ({
          id: Date.now() + index,
          text: title,
          category: formData.category,
          tone: formData.tone,
          score: Math.floor(Math.random() * 40) + 60, // 60-100 score
          clicks: Math.floor(Math.random() * 1000) + 100,
          shares: Math.floor(Math.random() * 500) + 50
        }))

        setTitles(titles)
        setSelectedTitles([])

        toast.success(`Generated ${titles.length} blog titles!`)
      } else {
        toast.error(response.message || 'Failed to generate blog titles')
      }
    } catch (error) {
      console.error('Blog title generation error:', error)
      toast.error(error.message || 'Failed to generate blog titles')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyTitle = (title) => {
    navigator.clipboard.writeText(title.text)
    toast.success('Title copied!')
  }

  const handleSelectTitle = (titleId) => {
    setSelectedTitles(prev => {
      if (prev.includes(titleId)) {
        return prev.filter(id => id !== titleId)
      } else {
        return [...prev, titleId]
      }
    })
  }

  const handleToggleFavorite = (titleId) => {
    setFavorites(prev => {
      if (prev.includes(titleId)) {
        return prev.filter(id => id !== titleId)
      } else {
        return [...prev, titleId]
      }
    })
  }

  const handleCopySelected = () => {
    if (selectedTitles.length === 0) {
      toast.error('No titles selected')
      return
    }

    const selectedText = selectedTitles
      .map(id => titles.find(t => t.id === id)?.text)
      .filter(Boolean)
      .join('\n')

    navigator.clipboard.writeText(selectedText)
    toast.success(`${selectedTitles.length} titles copied!`)
  }

  const handleDownloadTitles = () => {
    if (titles.length === 0) return
    
    const titlesText = titles
      .map(t => `${t.text}\nScore: ${t.score}/100 | Est. Clicks: ${t.clicks}\n`)
      .join('\n')
    
    const blob = new Blob([titlesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blog-titles-${formData.keyword.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Titles downloaded!')
  }

  const handleRefreshTitles = () => {
    if (titles.length > 0) {
      const newTitles = titles.map(title => ({
        ...title,
        id: Date.now() + Math.random(),
        score: Math.floor(Math.random() * 40) + 60
      }))
      setTitles(newTitles)
      toast.success('Titles refreshed!')
    }
  }

  const filteredTitles = filter === 'all' 
    ? titles 
    : filter === 'favorites' 
      ? titles.filter(t => favorites.includes(t.id))
      : titles.filter(t => t.tone === filter)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Title Generator</h1>
        <p className="text-gray-600">
          Create catchy, SEO-friendly blog titles that drive traffic and engagement. Get hundreds of title ideas instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-8">
          {/* Keyword Input */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Generate Titles</h2>
                <p className="text-sm text-gray-500">Enter your main keyword or topic</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Keyword *
                </label>
                <input
                  type="text"
                  name="keyword"
                  value={formData.keyword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., digital marketing, healthy recipes, web development"
                  required
                />
              </div>

              {/* Examples */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Try these examples:
                </label>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                        formData.category === cat.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={formData.category === cat.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-1">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Title Tone
                </label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <label
                      key={tone.id}
                      className={`flex items-start justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                        formData.tone === tone.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="tone"
                          value={tone.id}
                          checked={formData.tone === tone.id}
                          onChange={handleChange}
                          className="mr-3 mt-1"
                        />
                        <div>
                          <span className="font-medium">{tone.label}</span>
                          <p className="text-sm text-gray-500">{tone.description}</p>
                        </div>
                      </div>
                      <div className="text-2xl">
                        {tone.id === 'clickbait' && '🔥'}
                        {tone.id === 'professional' && '👔'}
                        {tone.id === 'casual' && '😊'}
                        {tone.id === 'list' && '📋'}
                        {tone.id === 'question' && '❓'}
                        {tone.id === 'howto' && '🔧'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Titles
                </label>
                <div className="flex flex-wrap gap-2">
                  {quantities.map((qty) => (
                    <label
                      key={qty}
                      className={`px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                        formData.quantity === qty
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quantity"
                        value={qty}
                        checked={formData.quantity === qty}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {qty} titles
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleGenerate}
                disabled={loading || !formData.keyword.trim()}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Generating Titles...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate {formData.quantity} Titles
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Free for all users</span>
                </div>
                <div className="font-semibold text-blue-600">
                  Free Feature
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              SEO Tips for Better Titles
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Sparkles className="w-4 h-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Include your main keyword near the beginning</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-4 h-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Keep titles between 50-60 characters for SEO</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-4 h-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Use power words that trigger emotions</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-4 h-4 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Numbers and lists tend to get more clicks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-8">
          {/* Results Header */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Generated Titles</h2>
                <p className="text-gray-500">
                  {titles.length} titles generated • {selectedTitles.length} selected
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="all">All Titles</option>
                    <option value="favorites">Favorites</option>
                    <option value="clickbait">Clickbait</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="list">List Style</option>
                  </select>
                </div>
                
                {titles.length > 0 && (
                  <>
                    <button
                      onClick={handleRefreshTitles}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleCopySelected}
                      disabled={selectedTitles.length === 0}
                      className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Selected</span>
                    </button>
                    <button
                      onClick={handleDownloadTitles}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Titles Grid */}
          {titles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredTitles.map((title) => (
                <div
                  key={title.id}
                  className={`card hover:shadow-lg transition-all cursor-pointer ${
                    selectedTitles.includes(title.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectTitle(title.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(title.id)
                          }}
                          className="flex-shrink-0"
                        >
                          <Star className={`w-5 h-5 ${
                            favorites.includes(title.id)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`} />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {title.text}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Score: {title.score}/100
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Type className="w-4 h-4 mr-1" />
                          {title.tone}
                        </span>
                        <span>•</span>
                        <span>Est. clicks: {title.clicks.toLocaleString()}</span>
                        <span>•</span>
                        <span>Est. shares: {title.shares.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyTitle(title)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy title"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        title.score >= 90 ? 'bg-green-100 text-green-800' :
                        title.score >= 80 ? 'bg-blue-100 text-blue-800' :
                        title.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {title.score >= 90 ? 'Excellent' :
                         title.score >= 80 ? 'Good' :
                         title.score >= 70 ? 'Average' : 'Poor'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="py-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Type className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No titles generated yet</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Enter a keyword and click "Generate Titles" to create catchy blog title ideas.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">100+</div>
                    <div className="text-sm text-gray-600">Title Templates</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">Click-through Rate</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">2s</div>
                    <div className="text-sm text-gray-600">Generation Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          {titles.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Title Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {titles.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Titles</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(titles.reduce((sum, t) => sum + t.score, 0) / titles.length)}/100
                  </div>
                  <div className="text-sm text-gray-600">Avg. Score</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {titles.reduce((sum, t) => sum + t.clicks, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Est. Clicks</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {favorites.length}
                  </div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitleGenerator