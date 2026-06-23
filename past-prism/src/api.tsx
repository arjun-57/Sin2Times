// api.tsx
export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  nodes?: Array<{
    id: string;
    title?: string;
    label?: string;
    category?: 'major' | 'minor' | 'cause' | 'effect' | 'root' | 'child';
    description?: string;
    date?: string;
    location?: string;
    people?: string;
    position?: { x: number; y: number };
  }>;
  edges?: Array<{
    id: string;
    source: string;
    target: string;
  }>;
  raw?: string;
  error?: string;
}

const BASE_URL = 'http://127.0.0.1:5000';

export const queryMindmap = async (query: string): Promise<QueryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: QueryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying mindmap:', error);
    throw new Error('Failed to connect to backend');
  }
};