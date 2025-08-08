import type {
    GenerateBlogRequest,
    BlogApiResponse,
    GenerateVersionRequest,
  } from '../types/blog';
  
  // Safely read the environment variable
  const API_BASE = import.meta.env.VITE_REACT_APP_API_URL;
  
  if (!API_BASE) {
    throw new Error('VITE_REACT_APP_API_URL is not defined in .env');
  }
  
  const FULL_API = `${API_BASE}/ai`;
  console.log('[blogService] API_BASE:', FULL_API);
  
  export async function generateBlog(data: GenerateBlogRequest): Promise<BlogApiResponse> {
    const res = await fetch(`${FULL_API}/generateArticle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      console.error('[generateBlog] Failed response:', res.status, res.statusText);
      throw new Error('Failed to generate blog');
    }
  
    return res.json();
  }
  
  export async function generateBlogVersion(data: GenerateVersionRequest): Promise<BlogApiResponse> {
    const res = await fetch(`${FULL_API}/generateArticleVersion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      console.error('[generateBlogVersion] Failed response:', res.status, res.statusText);
      throw new Error('Failed to generate blog version');
    }
  
    return res.json();
  }
  
  export async function setSelectedVersion(articleId: string, versionId: string): Promise<any> {
    const res = await fetch(`${FULL_API}/setSelectedVersion/${articleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    });
  
    if (!res.ok) {
      console.error('[setSelectedVersion] Failed response:', res.status, res.statusText);
      throw new Error('Failed to set selected version');
    }
  
    return res.json();
  }
  