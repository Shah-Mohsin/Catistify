type SyncRequest = {
  method?: string;
  body?: { data?: unknown };
};

type SyncResponse = {
  status: (code: number) => SyncResponse;
  json: (payload: unknown) => void;
};

let syncStore: unknown = null;

export default function handler(req: SyncRequest, res: SyncResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ data: syncStore, syncedAt: new Date().toISOString() });
    return;
  }

  if (req.method === 'POST') {
    syncStore = req.body?.data ?? null;
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
