export function detectESP(headers: any): string {
  const received = headers.get('received')?.toString() || '';
  const messageId = headers.get('message-id')?.toString() || '';

  if (received.includes('google.com') || messageId.includes('gmail.com')) return 'Gmail';
  if (received.includes('outlook.com') || messageId.includes('outlook.com')) return 'Outlook';
  if (received.includes('zoho.com')) return 'Zoho';
  if (received.includes('amazonaws.com')) return 'Amazon SES';

  return 'Unknown';
}
