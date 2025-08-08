import type { 
    CreateDomainRequest, 
    BulkCreateDomainRequest, 
    CreateDomainResponse, 
    BulkCreateDomainResponse,
    Domain 
  } from '../types/domain';
  
// ✅ Safer API base fallback
const API_BASE = `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/api/v1'}/domain`;
  console.log('[domainService] API_BASE:', API_BASE);
  
  // 🛠 Utility to safely parse error JSON
  async function parseErrorResponse(res: Response): Promise<string> {
    try {
      const errorData = await res.json();
      return errorData.error || 'Unknown error';
    } catch {
      return 'Server returned non-JSON response';
    }
  }
  
  // Domain CRUD Operations
  export async function createDomain(data: CreateDomainRequest): Promise<CreateDomainResponse> {
    const res = await fetch(`${API_BASE}/createDomain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function bulkCreateDomains(data: BulkCreateDomainRequest): Promise<BulkCreateDomainResponse> {
    const res = await fetch(`${API_BASE}/createDomain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function getDomain(id: string): Promise<Domain> {
    const res = await fetch(`${API_BASE}/getDomain/${id}`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function getAllDomains(): Promise<{ total: number; domains: Domain[] }> {
    const res = await fetch(`${API_BASE}/getAllDomains`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function updateDomain(id: string, data: Partial<CreateDomainRequest>): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/updateDomain/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function deleteDomain(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/deleteDomain/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  // Template/Layout Operations
  export async function getAvailableTemplates(): Promise<{ success: boolean; templates: string[]; count: number }> {
    const res = await fetch(`${API_BASE}/getAvailableTemplates`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function createDomainFolder(domainName: string): Promise<{ success: boolean; domainName: string; domainPath: string; message: string }> {
    const res = await fetch(`${API_BASE}/createDomainFolder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domainName }),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function switchDomainTemplate(domainName: string, newLayoutName: string): Promise<{ success: boolean; domainName: string; newLayoutName: string; configPath: string; message: string }> {
    const res = await fetch(`${API_BASE}/switchDomainTemplate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domainName, newLayoutName }),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function getDomainLayout(domainName: string): Promise<{ success: boolean; domainName: string; layout: string }> {
    const res = await fetch(`${API_BASE}/getDomainLayout/${domainName}`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function listDomains(): Promise<{ success: boolean; domains: Array<{ domainName: string; layout: string; lastModified: string; configPath: string }>; count: number }> {
    const res = await fetch(`${API_BASE}/listDomains`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function getDomainInfo(domainName: string): Promise<{ success: boolean; domainInfo: { domainName: string; layout: string; lastModified: string; configPath: string } }> {
    const res = await fetch(`${API_BASE}/getDomainInfo/${domainName}`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  // Blog Operations
  export async function addBlogToDomain(domainName: string, fileName: string, content: string): Promise<{ success: boolean; domainName: string; fileName: string; filePath: string; message: string }> {
    const res = await fetch(`${API_BASE}/addBlogToDomain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domainName, fileName, content }),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function addArticleToDomain(articleId: string, domainName: string): Promise<{ success: boolean; filePath: string; fileName: string; message: string; article: any }> {
    const res = await fetch(`${API_BASE}/addArticleToDomain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, domainName }),
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  // Utility Operations
  export async function buildDomain(domainName: string): Promise<{ success: boolean; domainName: string; message: string; installOutput: string; buildOutput: string }> {
    const res = await fetch(`${API_BASE}/buildDomain/${domainName}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function getDomainStatus(domainName: string): Promise<{ success: boolean; domainName: string; status: { exists: boolean; hasNodeModules: boolean; hasDist: boolean; postCount: number; layout: string; lastModified: string } }> {
    const res = await fetch(`${API_BASE}/getDomainStatus/${domainName}`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.json();
  }
  
  export async function downloadDomain(domainName: string): Promise<Blob> {
    const res = await fetch(`${API_BASE}/downloadDomain/${domainName}`);
    if (!res.ok) throw new Error(await parseErrorResponse(res));
    return res.blob();
  }
  