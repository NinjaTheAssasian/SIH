// Simple text extraction - for MVP, we'll use basic text extraction
// In production, replace with a proper PDF parsing library or service
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // For MVP, we'll just return a placeholder
    // In production, use a proper PDF parsing service or library
    return 'PDF parsing not implemented in MVP. Please upload a plain text resume for automatic extraction, or manually enter your information.'
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF. Please upload a plain text resume.')
  }
}

export function extractTextFromPlainText(buffer: Buffer): string {
  return buffer.toString('utf-8')
}
