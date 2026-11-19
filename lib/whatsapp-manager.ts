import makeWASocket, {
  Browsers,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  WASocket,
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import { usePrismaAuthState } from "./baileys-auth";
import { prisma } from "./prisma";

// Global map to hold active WASocket connections in memory across API calls / requests
const globalForWhatsapp = globalThis as unknown as {
  waSessions: Map<number, WASocket>;
  waConnecting: Set<number>;
};

if (!globalForWhatsapp.waSessions) {
  globalForWhatsapp.waSessions = new Map<number, WASocket>();
}
if (!globalForWhatsapp.waConnecting) {
  globalForWhatsapp.waConnecting = new Set<number>();
}

export const sessions = globalForWhatsapp.waSessions;
const connectingLocks = globalForWhatsapp.waConnecting;

const logger = pino({ level: "silent" });

export async function startWhatsappSession(accountId: number): Promise<void> {
  // Prevent duplicate concurrent initialization calls for the same account
  if (connectingLocks.has(accountId)) {
    return;
  }
  connectingLocks.add(accountId);

  try {
    // If an existing socket is active, clean it up
    const existingSocket = sessions.get(accountId);
    if (existingSocket) {
      try {
        existingSocket.end(undefined);
      } catch {
        // ignore
      }
      sessions.delete(accountId);
    }

    const { state, saveCreds } = await usePrismaAuthState(accountId);

    // If account already has saved credentials with phone number, preserve it
    const hasExistingMe = Boolean(state.creds?.me?.id);
    const existingPhone = state.creds?.me?.id
      ? state.creds.me.id.split(":")[0]?.replace(/[^0-9]/g, "")
      : null;

    // Update account initial status
    await prisma.whatsappAccount.update({
      where: { id: accountId },
      data: {
        status: hasExistingMe ? "CONNECTING" : "CONNECTING",
        phone_number: existingPhone || undefined,
        jid: existingPhone ? `${existingPhone}@s.whatsapp.net` : undefined,
      },
    });

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      logger,
      printQRInTerminal: false,
      browser: Browsers.ubuntu("Chrome"),
      syncFullHistory: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
    });

    sessions.set(accountId, sock);

    sock.ev.on("creds.update", async () => {
      await saveCreds();

      // Whenever credentials receive the phone info, update the DB
      const phoneId = state.creds?.me?.id;
      if (phoneId) {
        const phone = phoneId.split(":")[0]?.replace(/[^0-9]/g, "");
        if (phone) {
          await prisma.whatsappAccount
            .update({
              where: { id: accountId },
              data: {
                phone_number: phone,
                jid: `${phone}@s.whatsapp.net`,
              },
            })
            .catch(() => {});
        }
      }
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          const qrDataUrl = await QRCode.toDataURL(qr, {
            width: 300,
            margin: 2,
          });

          await prisma.whatsappAccount.update({
            where: { id: accountId },
            data: {
              qr: qrDataUrl,
              status: "CONNECTING",
            },
          });
        } catch (err) {
          console.error(`[Account ${accountId}] Error generating QR:`, err);
        }
      }

      if (connection === "open") {
        const rawJid = sock.user?.id || state.creds?.me?.id || "";
        const phone = rawJid.split(":")[0]?.replace(/[^0-9]/g, "") || "";
        const cleanJid = phone ? `${phone}@s.whatsapp.net` : rawJid;

        console.log(`[Account ${accountId}] WhatsApp connected successfully! Phone: ${phone}`);

        await prisma.whatsappAccount.update({
          where: { id: accountId },
          data: {
            status: "CONNECTED",
            qr: null,
            phone_number: phone || undefined,
            jid: cleanJid || undefined,
          },
        });
      }

      if (connection === "close") {
        const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } })
          ?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;

        sessions.delete(accountId);

        if (isLoggedOut) {
          console.log(`[Account ${accountId}] Logged out by user.`);
          // Clear all stored sessions for this account
          await prisma.whatsappSession.deleteMany({
            where: { account_id: accountId },
          });

          await prisma.whatsappAccount.update({
            where: { id: accountId },
            data: {
              status: "DISCONNECTED",
              qr: null,
              phone_number: null,
              jid: null,
            },
          });
        } else {
          // Reconnect on restartRequired (515) or temporary network disconnect
          console.log(
            `[Account ${accountId}] Socket closed (code: ${statusCode}). Auto-reconnecting...`
          );

          await prisma.whatsappAccount.update({
            where: { id: accountId },
            data: {
              status: "CONNECTING",
              qr: null,
            },
          });

          setTimeout(() => {
            startWhatsappSession(accountId).catch((err) => {
              console.error(`[Account ${accountId}] Reconnection error:`, err);
            });
          }, 2000);
        }
      }
    });
  } catch (error) {
    console.error(`[Account ${accountId}] startWhatsappSession error:`, error);
  } finally {
    connectingLocks.delete(accountId);
  }
}

export async function disconnectWhatsappSession(accountId: number): Promise<void> {
  const sock = sessions.get(accountId);
  if (sock) {
    try {
      await sock.logout();
    } catch {
      sock.end(undefined);
    }
    sessions.delete(accountId);
  }

  await prisma.whatsappSession.deleteMany({
    where: { account_id: accountId },
  });

  await prisma.whatsappAccount.update({
    where: { id: accountId },
    data: {
      status: "DISCONNECTED",
      qr: null,
      phone_number: null,
      jid: null,
    },
  });
}

export async function deleteWhatsappAccount(accountId: number): Promise<void> {
  const sock = sessions.get(accountId);
  if (sock) {
    try {
      sock.end(undefined);
    } catch {
      // ignore
    }
    sessions.delete(accountId);
  }

  await prisma.whatsappAccount.delete({
    where: { id: accountId },
  });
}
