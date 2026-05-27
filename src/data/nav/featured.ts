import { link } from './helpers'

export const featuredLinks = [
  link({
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    description: 'OpenAI 开发的 AI 聊天助手。',
    section: 'ai',
    featured: true,
    tags: ['ai'],
  }),
  link({
    id: 'xueshutong',
    name: '学术通',
    url: 'https://www.xueshutong.com/',
    description: '科研文献检索和下载平台。',
    section: 'literature',
    featured: true,
    tags: ['literature'],
  }),
]
