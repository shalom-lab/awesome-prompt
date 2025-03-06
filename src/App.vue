<template>
  <div class="app-container" :class="{ 'dark-mode': darkMode }">
    <header class="header">
      <div class="logo-container">
        <div class="logo">AP</div>
        <h1>{{ t('header.title') }}</h1>
        <div class="github-links">
          <a href="https://github.com/shalom-lab/awesome-prompt" target="_blank" class="github-link" :title="t('header.github')">
            <svg height="24" width="24" viewBox="0 0 16 16" class="github-icon">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <a href="https://github.com/shalom-lab/easy-prompt" target="_blank" class="github-link secondary" :title="t('header.easyPrompt')">
            <svg height="20" width="20" viewBox="0 0 16 16" class="github-icon">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span class="link-text">Easy Prompt</span>
          </a>
        </div>
      </div>
      <div class="actions">
        <button @click="showSelectedPrompts" class="view-selected-btn" :disabled="!selectedPrompts.length">
          <span class="view-icon">👁️</span>
          <span>{{ t('header.viewSelected').replace('{count}', selectedPrompts.length) }}</span>
        </button>
        <button @click="toggleDarkMode" class="icon-btn" :title="t('header.darkMode')">
          <span v-if="darkMode">🌞</span>
          <span v-else>🌙</span>
        </button>
        <div class="language-select-container">
          <select v-model="currentLang" class="language-select" @change="handleLanguageChange">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </header>

    <div class="search-container">
      <input type="text" v-model="searchQuery" :placeholder="t('search.placeholder')" class="search-input" />
    </div>

    <!-- 类别 Tab 导航 -->
    <div class="category-tabs">
      <button class="tab-btn tab-btn-all" :class="{ active: selectedCategories.length === 0 }"
        @click="selectedCategories = []">
        {{ t('categories.all') }}
      </button>
      <button v-for="category in uniqueCategories" :key="category" class="tab-btn" :class="{
        active: selectedCategories.includes(category),
        [getCategoryClass(category)]: true
      }" @click="toggleCategory(category)">
        {{ category }}
        <span class="tab-count">{{ getCategoryCount(category) }}</span>
      </button>
    </div>

    <div class="main-content">
      <aside class="filters">
        <div class="filter-section">
          <h3>{{ t('filters.keywords') }}</h3>
          <div class="keyword-search">
            <input type="text" v-model="keywordFilter" :placeholder="t('filters.searchKeywords')"
              class="keyword-search-input" />
          </div>
          <div class="keywords">
            <label v-for="keyword in filteredKeywords" :key="keyword" class="filter-label keyword-label">
              <input type="checkbox" v-model="selectedKeywords" :value="keyword">
              <span class="checkmark"></span>
              <span class="label-text">{{ keyword }}</span>
            </label>
          </div>
          <button v-if="filteredUniqueKeywords.length > 20 && !showAllKeywords" @click="showAllKeywords = true"
            class="show-more-btn">
            {{ t('filters.showMore') }}
          </button>
        </div>
      </aside>

      <main class="prompt-list">
        <transition-group name="prompt-fade">
          <div v-for="prompt in filteredPrompts" :key="prompt.prompt" class="prompt-card">
            <div class="prompt-header" @click="togglePromptSelection(prompt)">
              <label class="select-container">
                <input type="checkbox" v-model="selectedPrompts" :value="prompt" @click.stop>
                <span class="select-checkmark"></span>
              </label>
              <span class="category-tag" :class="getCategoryClass(prompt.category)">
                {{ prompt.category }}
              </span>
            </div>
            <div class="prompt-content" @click="copyPrompt(prompt.prompt)">
              {{ prompt.prompt }}
              <div class="copy-hint">{{ t('prompts.copyHint') }}</div>
            </div>
            <div class="prompt-keywords">
              <span v-for="keyword in prompt.keywords" :key="keyword" class="keyword-tag"
                @click="toggleKeyword(keyword)">
                {{ keyword }}
              </span>
            </div>
          </div>
        </transition-group>
        <div v-if="filteredPrompts.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>{{ t('prompts.noResults') }}</p>
        </div>
      </main>
    </div>

    <!-- 已选提示词模态框 -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>{{ t('modal.title').replace('{count}', selectedPrompts.length) }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-for="(prompt, index) in selectedPrompts" :key="index" class="selected-prompt-item">
            <div class="selected-prompt-header">
              <span class="category-tag" :class="getCategoryClass(prompt.category)">
                {{ prompt.category }}
              </span>
              <button class="remove-btn" @click="removeSelectedPrompt(prompt)">
                {{ t('modal.remove') }}
              </button>
            </div>
            <div class="selected-prompt-content" @click="copyPrompt(prompt.prompt)">
              {{ prompt.prompt }}
              <div class="copy-hint">{{ t('prompts.copyHint') }}</div>
            </div>
          </div>
          <div v-if="!selectedPrompts.length" class="no-selected">
            <p>{{ t('modal.noSelected') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <div class="export-options">
            <label class="simple-mode-label">
              <input type="checkbox" v-model="simpleExportMode">
              <span>{{ t('modal.simpleMode') }}</span>
            </label>
            <a href="https://github.com/shalom-lab/easy-prompt" 
               target="_blank" 
               class="easy-prompt-link"
               title="Visit Easy Prompt">
              <svg height="20" width="20" viewBox="0 0 16 16" class="github-icon">
                <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Easy Prompt
            </a>
          </div>
          <div class="modal-actions">
            <button class="clear-btn" @click="clearSelected" :disabled="!selectedPrompts.length">
              {{ t('modal.clearAll') }}
            </button>
            <button class="export-modal-btn" @click="exportSelected" :disabled="!selectedPrompts.length">
              {{ t('modal.export') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="toast" :class="{ 'show-toast': showToast }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { messages } from './locales'

const prompts = ref([])
const selectedPrompts = ref([])
const selectedCategories = ref([])
const selectedKeywords = ref([])
const searchQuery = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const darkMode = ref(false)
const showAllKeywords = ref(false)
const keywordFilter = ref('')
const showModal = ref(false)
const currentLang = ref('zh')
const simpleExportMode = ref(true)

// 翻译函数
const t = computed(() => (key) => {
  const keys = key.split('.')
  let value = messages[currentLang.value]
  for (const k of keys) {
    if (!value || !value[k]) return key
    value = value[k]
  }
  return value
})

// 从系统偏好设置初始化暗黑模式
onMounted(() => {
  // 检测系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  darkMode.value = prefersDark

  loadPrompts()
})

// 加载提示词数据
const loadPrompts = async () => {
  try {
    // 开发环境使用本地路径，生产环境使用相对于 base URL 的路径
    const baseUrl = import.meta.env.DEV ? '' : '/awesome-prompt'
    const response = await fetch(`${baseUrl}/awesome_prompts.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    prompts.value = data
  } catch (error) {
    console.error('Failed to load prompts:', error)
    showToastMessage('加载提示词失败，请刷新页面重试')
  }
}

// 获取唯一的分类列表
const uniqueCategories = computed(() => {
  return [...new Set(prompts.value.map(p => p.category))]
})

// 获取唯一的关键词列表
const uniqueKeywords = computed(() => {
  const keywords = prompts.value.flatMap(p => p.keywords)
  return [...new Set(keywords)].sort()
})

// 过滤后的关键词列表
const filteredUniqueKeywords = computed(() => {
  if (!keywordFilter.value) {
    return uniqueKeywords.value
  }
  return uniqueKeywords.value.filter(keyword =>
    keyword.toLowerCase().includes(keywordFilter.value.toLowerCase())
  )
})

// 显示的关键词（可能受限制）
const filteredKeywords = computed(() => {
  if (showAllKeywords.value) {
    return filteredUniqueKeywords.value
  }
  return filteredUniqueKeywords.value.slice(0, 20)
})

// 修改原来的 displayedKeywords 计算属性
const displayedKeywords = computed(() => {
  if (showAllKeywords.value) {
    return uniqueKeywords.value
  }
  return uniqueKeywords.value.slice(0, 20)
})

// 根据筛选条件过滤prompts
const filteredPrompts = computed(() => {
  return prompts.value.filter(prompt => {
    // 分类筛选
    const categoryMatch = selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(prompt.category)

    // 关键词筛选
    const keywordMatch = selectedKeywords.value.length === 0 ||
      selectedKeywords.value.some(k => prompt.keywords.includes(k))

    // 搜索筛选
    const searchMatch = !searchQuery.value ||
      prompt.prompt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prompt.keywords.some(k => k.toLowerCase().includes(searchQuery.value.toLowerCase()))

    return categoryMatch && keywordMatch && searchMatch
  })
})

// 获取每个分类的提示词数量
const getCategoryCount = (category) => {
  return prompts.value.filter(p => p.category === category).length
}

// 根据分类获取样式类
const getCategoryClass = (category) => {
  if (!category) return 'category-default'
  
  // 使用简单的字符串哈希函数
  const hashCode = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // 预定义的颜色数组
  const colors = [
    '#FF4D4D', // 珊瑚红
    '#7C3AED', // 靛紫色
    '#2DD4BF', // 蓝绿色
    '#F59E0B', // 琥珀色
    '#EC4899', // 玫瑰粉
    '#3B82F6', // 天蓝色
    '#10B981', // 翡翠绿
    '#8B5CF6', // 淡紫色
    '#F97316', // 橙色
    '#06B6D4', // 青色
    '#6366F1', // 靛蓝色
    '#84CC16'  // 青柠绿
  ]

  // 使用哈希值选择颜色
  const colorIndex = hashCode(category) % colors.length
  const color = colors[colorIndex]

  // 动态创建样式
  const style = document.createElement('style')
  style.textContent = `
    .category-${hashCode(category)} {
      background: linear-gradient(135deg, ${color}, ${adjustColor(color, -20)});
    }
  `
  // 如果样式不存在则添加
  if (!document.querySelector(`style[data-category="${category}"]`)) {
    style.setAttribute('data-category', category)
    document.head.appendChild(style)
  }

  return `category-${hashCode(category)}`
}

// 辅助函数：调整颜色明度
const adjustColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) + percent
  const g = ((num >> 8) & 0x00FF) + percent
  const b = (num & 0x0000FF) + percent
  
  const newR = Math.min(255, Math.max(0, r))
  const newG = Math.min(255, Math.max(0, g))
  const newB = Math.min(255, Math.max(0, b))
  
  return '#' + (newB | (newG << 8) | (newR << 16)).toString(16).padStart(6, '0')
}

// 切换分类选择
const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category)
  } else {
    selectedCategories.value = [category] // 单选模式
  }
}

// 复制prompt到剪贴板
const copyPrompt = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('copied')
  } catch (err) {
    console.error('复制失败:', err)
    showToastMessage('copyFailed')
  }
}

// 显示提示消息
const showToastMessage = (messageKey, params = {}) => {
  let message = t.value(`toast.${messageKey}`)
  for (const [key, value] of Object.entries(params)) {
    message = message.replace(`{${key}}`, value)
  }
  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 导出选中的prompts
const exportSelected = () => {
  try {
    const exportData = simpleExportMode.value
      ? selectedPrompts.value.map(item => item.prompt)
      : selectedPrompts.value
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const today = new Date()
    const dateStr = today.getFullYear() +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      ('0' + today.getDate()).slice(-2)
    const fileName = `awesome_prompts_${dateStr}${simpleExportMode.value ? '_simple' : ''}.json`

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToastMessage('exported', { count: selectedPrompts.value.length })
  } catch (error) {
    console.error('导出失败:', error)
    showToastMessage('exportFailed')
  }
}

// 切换关键词选择
const toggleKeyword = (keyword) => {
  if (selectedKeywords.value.includes(keyword)) {
    selectedKeywords.value = selectedKeywords.value.filter(k => k !== keyword)
  } else {
    selectedKeywords.value.push(keyword)
  }
}

// 切换暗黑模式
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

// 处理语言切换
const handleLanguageChange = () => {
  // 直接使用响应式变量，无需存储
}

// 监听暗黑模式变化，更新文档类
watch(darkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark-theme')
    document.body.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
    document.body.classList.remove('dark-theme')
  }
}, { immediate: true })

// 添加新函数：切换提示词选择
const togglePromptSelection = (prompt) => {
  if (selectedPrompts.value.includes(prompt)) {
    selectedPrompts.value = selectedPrompts.value.filter(p => p !== prompt)
  } else {
    selectedPrompts.value.push(prompt)
  }
}

// 显示已选提示词模态框
const showSelectedPrompts = () => {
  showModal.value = true
  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  // 恢复背景滚动
  document.body.style.overflow = 'auto'
}

// 从已选列表中移除提示词
const removeSelectedPrompt = (prompt) => {
  selectedPrompts.value = selectedPrompts.value.filter(p => p !== prompt)
}

// 清空所有已选提示词
const clearSelected = () => {
  selectedPrompts.value = []
  closeModal()
  showToastMessage('已清空所有已选提示词')
}
</script>

<style>
/* 颜色变量定义 */
:root {
  /* 主色调 */
  --primary-color: #4361ee;
  --primary-dark-color: #3a56d4;
  --secondary-color: #4cc9f0;
  --accent-color: #f72585;
  --success-color: #4ade80;
  --warning-color: #fbbf24;
  --danger-color: #ef4444;

  /* 亮色模式 */
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --input-bg: #ffffff;
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.05);

  /* 类别颜色 */
  --category-dev: #4361ee;
  --category-code: #3a0ca3;
  --category-image: #7209b7;
  --category-chat: #f72585;
  --category-business: #4cc9f0;
  --category-analysis: #4ade80;
  --category-default: #64748b;

  background-color: var(--bg-color);
}

/* 暗色模式变量 */
.dark-mode {
  --bg-color: #121212;
  --card-bg: #1e1e1e;
  --card-dark-bg: #1e1e1e;
  --input-bg: #2d2d2d;
  --input-dark-bg: #2d2d2d;
  --text-color: #ffffff;
  --text-dark-color: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #333333;
  --border-dark-color: #333333;
  --shadow-color: rgba(0, 0, 0, 0.3);

  /* 暗色模式类别颜色 - 更亮更柔和 */
  --category-dev: #60a5fa;
  --category-code: #818cf8;
  --category-image: #c084fc;
  --category-chat: #f472b6;
  --category-business: #38bdf8;
  --category-analysis: #4ade80;
  --category-default: #94a3b8;
}

/* 全局样式 */
html,
body {
  background-color: var(--bg-color);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

body.dark-theme {
  background-color: #121212;
}

/* 基础布局 */
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 修复暗色模式下的header标题颜色 */
.dark-mode h1 {
  color: var(--text-color);
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header h1 {
  color: var(--text-color);
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 4px;
}

.dark-mode .header h1 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.export-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.export-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.export-icon {
  font-size: 18px;
}

/* 搜索框 */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  font-size: 16px;
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: all 0.3s;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
}

.dark-mode .search-input {
  background-color: var(--card-dark-bg);
  color: var(--text-dark-color);
  border-color: var(--border-dark-color);
}

/* 类别标签 */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  padding-top: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  scrollbar-width: thin;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: var(--card-bg);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px var(--shadow-color);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-sizing: border-box;
}

.dark-mode .tab-btn {
  background-color: var(--card-dark-bg);
  color: var(--text-dark-color);
}

.tab-btn:hover {
  transform: translateY(0px);
  opacity: 0.8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tab-btn.active {
  background-color: var(--primary-color);
  color: white;
  box-sizing: border-box;
}

.tab-count {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.tab-btn-all {
  color: #000000;
  width: 60px;
  text-align: center !important;
}

.tab-btn-all.active {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

/* 过滤器样式 */
.filters {
  background: var(--card-bg);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.dark-mode .filters {
  background-color: var(--card-dark-bg);
  box-shadow: 0 4px 6px var(--shadow-dark-color);
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section h3 {
  margin-bottom: 15px;
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
  position: relative;
  padding-bottom: 8px;
}

.filter-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 3px;
}

.keyword-search {
  margin-bottom: 15px;
}

.keyword-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: all 0.2s;
}

.keyword-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.dark-mode .keyword-search-input {
  background-color: var(--card-dark-bg);
  color: var(--text-dark-color);
  border-color: var(--border-dark-color);
}

.keywords {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-label {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 15px;
  user-select: none;
  transition: all 0.2s;
}

.filter-label:hover {
  color: var(--primary-color);
}

.filter-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  transition: all 0.2s;
}

.dark-mode .checkmark {
  background-color: #555;
}

.filter-label:hover input~.checkmark {
  background-color: #ccc;
}

.filter-label input:checked~.checkmark {
  background-color: var(--primary-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.filter-label input:checked~.checkmark:after {
  display: block;
}

.filter-label .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.label-text {
  flex: 1;
}

.show-more-btn {
  margin-top: 15px;
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.2s;
  width: 100%;
}

.show-more-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 提示词列表 */
.prompt-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  align-content: start;
}

.prompt-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
  box-shadow: 0 4px 6px var(--shadow-color);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.dark-mode .prompt-card {
  background-color: var(--card-dark-bg);
  box-shadow: 0 4px 6px var(--shadow-dark-color);
  border-color: var(--border-dark-color);
}

.prompt-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.prompt-header:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.dark-mode .prompt-header:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.select-container {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.select-container input {
  opacity: 0;
  width: 0;
  height: 0;
}

.select-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #eee;
  border-radius: 4px;
  transition: all 0.2s;
}

.dark-mode .select-checkmark {
  background-color: #555;
}

.select-container:hover .select-checkmark {
  background-color: #ccc;
}

.select-container input:checked~.select-checkmark {
  background-color: var(--primary-color);
}

.select-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.select-container input:checked~.select-checkmark:after {
  display: block;
}

.select-container .select-checkmark:after {
  left: 9px;
  top: 5px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.category-tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.category-default {
  background: linear-gradient(135deg, #64748b, #94a3b8);
}

.prompt-content {
  margin: 15px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  flex-grow: 1;
  line-height: 1.5;
}

.dark-mode .prompt-content {
  background-color: rgba(255, 255, 255, 0.05);
}

.prompt-content:hover {
  background: rgba(67, 97, 238, 0.1);
}

.copy-hint {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.prompt-content:hover .copy-hint {
  opacity: 1;
}

.prompt-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.keyword-tag {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;
  cursor: pointer;
}

.dark-mode .keyword-tag {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-dark-color);
}

.keyword-tag:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* 提示消息 */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
}

.show-toast {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  visibility: visible;
}

.dark-mode .toast {
  background-color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 无结果提示 */
.no-results {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #6c757d;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

/* 动画效果 */
.prompt-fade-enter-active,
.prompt-fade-leave-active {
  transition: all 0.3s ease;
}

.prompt-fade-enter-from,
.prompt-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .filters {
    position: static;
    margin-bottom: 30px;
  }
}

@media (max-width: 768px) {
  .prompt-list {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .actions {
    width: 100%;
    justify-content: space-between;
  }

  .category-tabs {
    padding-bottom: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* 查看已选按钮 */
.view-selected-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-right: 10px;
}

.view-selected-btn:hover {
  transform: translateY(-2px);
}

.view-selected-btn:disabled {
  background: #6c757d !important;
  cursor: not-allowed;
  transform: none;
}

.view-icon {
  font-size: 16px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background-color: var(--card-bg);
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-appear 0.3s ease;
}

.dark-mode .modal-container {
  background-color: var(--card-dark-bg);
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark-mode .modal-header {
  border-color: var(--border-dark-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-color);
}

.dark-mode .modal-header h2 {
  color: var(--text-dark-color);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .close-btn {
  color: var(--text-dark-color);
}

.dark-mode .close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

.selected-prompt-item {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
}

.dark-mode .selected-prompt-item {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--border-dark-color);
}

.selected-prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background-color: #c82333;
}

.selected-prompt-content {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
}

.dark-mode .selected-prompt-content {
  background-color: rgba(255, 255, 255, 0.05);
}

.selected-prompt-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.no-selected {
  text-align: center;
  padding: 30px 0;
  color: #6c757d;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.dark-mode .modal-footer {
  border-color: var(--border-dark-color);
}

.export-options {
  display: flex;
  align-items: center;
  gap: 15px;
}

.simple-mode-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.dark-mode .simple-mode-label {
  color: var(--text-dark-color);
}

.clear-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.clear-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-modal-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-modal-btn:hover {
  background-color: var(--primary-dark-color);
}

.export-modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .actions {
    flex-wrap: wrap;
    gap: 10px;
  }

  .view-selected-btn,
  .export-btn {
    flex: 1;
    justify-content: center;
    margin-right: 0;
  }

  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-body {
    max-height: calc(95vh - 140px);
  }
}

.language-select {
  appearance: none;
  background: transparent;
  color: var(--text-color);
  padding: 6px 24px 6px 12px;
  border: 0px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  text-align: left;
}

.dark-mode .language-select {
  color: var(--text-dark-color);
  background-color: var(--card-dark-bg);
}

.github-links {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
}

.github-link {
  display: flex;
  align-items: center;
  color: var(--text-color);
  text-decoration: none;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.github-link.secondary {
  font-size: 14px;
  gap: 4px;
  opacity: 0.8;
}

.github-link.secondary:hover {
  opacity: 1;
}

.github-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.dark-mode .github-link {
  color: var(--text-dark-color);
}

.dark-mode .github-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.github-icon {
  transition: transform 0.3s ease;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
}

.link-text {
  display: inline-block;
  vertical-align: middle;
}
</style>
