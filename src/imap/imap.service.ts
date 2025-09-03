// imap.service.ts
import { Injectable } from "@nestjs/common";
import * as imap from "imap-simple";
import { simpleParser } from "mailparser";

@Injectable()
export class ImapService {
  async fetchEmails() {
    const config = {
      imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST,
        port: Number(process.env.IMAP_PORT) || 993,
        tls: process.env.IMAP_TLS === "true",
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    const connection = await imap.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["ALL"];
    const fetchOptions = { bodies: [""], markSeen: true };

    const results = await connection.search(searchCriteria, fetchOptions);

    //ESP detect
    const emails: any[] = [];
    for (const res of results) {
      const all = res.parts.find((p: any) => p.which === "");
      const parsed = await simpleParser(all.body);

      const subject = parsed.subject || "(no subject)";

      // Receiving chain
      const receivedHeaders = parsed.headerLines
        .filter((h) => h.key.toLowerCase() === "received")
        .map((h) => h.line);

      const espType = detectESP(parsed.headers);

      emails.push({
        subject,
        headers: parsed.headers,
        receivingChain: receivedHeaders,
        espType,
      });
    }

    connection.end();
    return emails;
  }
}

// Utility to detect ESP
export function detectESP(headers: any): string {
  const received = headers.get("received")?.toString() || "";
  if (received.includes("google.com")) return "Gmail";
  if (received.includes("outlook.com")) return "Outlook";
  if (received.includes("zoho.com")) return "Zoho";
  if (received.includes("amazonaws.com")) return "Amazon SES";
  return "Unknown";
}
