const STORAGE_KEY = "municipal_documents";

const defaultDocuments = [
  {
    id: "Doc - 1001",
    title: "Building Permit Request",
    origin: "Markets",
    current: "Mayor",
    status: "Declined",
    assign: "J. Silivalism",
    received: "01/15/2026",
    updated: "02/15/2026",
    days: 5,
    due: "05/15/2026",
    priority: "Normal",
  },
  {
    id: "Doc - 1002",
    title: "Approval Document",
    origin: "Mayor",
    current: "Mayor",
    status: "Pending",
    assign: "D. Coley",
    received: "01/15/2026",
    updated: "02/15/2026",
    days: 5,
    due: "05/15/2026",
    priority: "Normal",
  },
  {
    id: "Doc - 1003",
    title: "SALN",
    origin: "SB",
    current: "Mayor",
    status: "Incoming",
    assign: "K. Pance",
    received: "01/15/2026",
    updated: "02/15/2026",
    days: 5,
    due: "05/15/2026",
    priority: "Urgent",
  },
  {
    id: "Doc - 1004",
    title: "Support Request",
    origin: "Tourism",
    current: "Mayor",
    status: "Returned",
    assign: "S. Edwards",
    received: "01/15/2026",
    updated: "02/15/2026",
    days: 5,
    due: "03/15/2026",
    priority: "High",
  },
  {
    id: "Doc - 1005",
    title: "Business Permit",
    origin: "Mayor",
    current: "Mayor",
    status: "Completed",
    assign: "A. Mutter",
    received: "01/15/2026",
    updated: "02/15/2026",
    days: 5,
    due: "02/28/2026",
    priority: "Normal",
  },
];

function notifyChange() {
  window.dispatchEvent(new Event("documentsUpdated"));
}

export function seedDocuments() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDocuments));
  }
}

export function getDocuments() {
  seedDocuments();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveDocuments(documents) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  notifyChange();
}

export function generateDocId() {
  const docs = getDocuments();
  const maxNum = docs.reduce((max, doc) => {
    const match = doc.id.match(/(\d+)/);
    const num = match ? parseInt(match[1], 10) : 1000;
    return Math.max(max, num);
  }, 1000);

  return `Doc - ${maxNum + 1}`;
}

export function addDocument(document) {
  const docs = getDocuments();
  const newDocs = [document, ...docs];
  saveDocuments(newDocs);
}

export function updateDocument(updatedDocument) {
  const docs = getDocuments();
  const newDocs = docs.map((doc) =>
    doc.id === updatedDocument.id ? updatedDocument : doc
  );
  saveDocuments(newDocs);
}

export function deleteDocument(id) {
  const docs = getDocuments();
  const newDocs = docs.filter((doc) => doc.id !== id);
  saveDocuments(newDocs);
}