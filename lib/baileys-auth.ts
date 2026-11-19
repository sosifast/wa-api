import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  initAuthCreds,
  proto,
  SignalDataTypeMap,
  SignalKeyStore,
} from "@whiskeysockets/baileys";
import { prisma } from "./prisma";

export async function usePrismaAuthState(accountId: number): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}> {
  // Read creds from database
  const existingCredsRecord = await prisma.whatsappSession.findUnique({
    where: {
      account_id_session_id: {
        account_id: accountId,
        session_id: "creds",
      },
    },
  });

  let creds: AuthenticationCreds;
  if (existingCredsRecord?.data) {
    try {
      creds = JSON.parse(existingCredsRecord.data, BufferJSON.reviver);
    } catch {
      creds = initAuthCreds();
    }
  } else {
    creds = initAuthCreds();
  }

  const saveCreds = async () => {
    try {
      const serialized = JSON.stringify(creds, BufferJSON.replacer);
      await prisma.whatsappSession.upsert({
        where: {
          account_id_session_id: {
            account_id: accountId,
            session_id: "creds",
          },
        },
        update: {
          data: serialized,
        },
        create: {
          account_id: accountId,
          session_id: "creds",
          data: serialized,
        },
      });
    } catch (err) {
      console.error(`[Account ${accountId}] Failed to save creds:`, err);
    }
  };

  const keys: SignalKeyStore = {
    get: async (type, ids) => {
      const data: Record<string, SignalDataTypeMap[typeof type]> = {};
      const prefix = `${type}:`;
      const sessionIds = ids.map((id) => `${prefix}${id}`);

      try {
        const records = await prisma.whatsappSession.findMany({
          where: {
            account_id: accountId,
            session_id: {
              in: sessionIds,
            },
          },
        });

        for (const record of records) {
          if (record.session_id.startsWith(prefix)) {
            const id = record.session_id.slice(prefix.length);
            try {
              let val = JSON.parse(record.data, BufferJSON.reviver);
              if (type === "app-state-sync-key" && val) {
                val = proto.Message.AppStateSyncKeyData.fromObject(val);
              }
              data[id] = val;
            } catch {
              // ignore parse error
            }
          }
        }
      } catch (err) {
        console.error(`[Account ${accountId}] Failed to get keys for ${type}:`, err);
      }

      return data;
    },
    set: async (data) => {
      const tasks: (() => Promise<unknown>)[] = [];

      for (const category of Object.keys(data)) {
        const type = category as keyof SignalDataTypeMap;
        const categoryData = data[type];
        if (!categoryData) continue;

        for (const id of Object.keys(categoryData)) {
          const value = categoryData[id];
          const sessionId = `${type}:${id}`;

          if (value) {
            const serialized = JSON.stringify(value, BufferJSON.replacer);
            tasks.push(() =>
              prisma.whatsappSession.upsert({
                where: {
                  account_id_session_id: {
                    account_id: accountId,
                    session_id: sessionId,
                  },
                },
                update: {
                  data: serialized,
                },
                create: {
                  account_id: accountId,
                  session_id: sessionId,
                  data: serialized,
                },
              })
            );
          } else {
            tasks.push(() =>
              prisma.whatsappSession
                .deleteMany({
                  where: {
                    account_id: accountId,
                    session_id: sessionId,
                  },
                })
                .catch(() => {})
            );
          }
        }
      }

      // Execute tasks in small batches of 5 to avoid database connection pool exhaustion
      for (let i = 0; i < tasks.length; i += 5) {
        const batch = tasks.slice(i, i + 5).map((fn) => fn());
        await Promise.all(batch).catch((err) => {
          console.error(`[Account ${accountId}] Error saving keys batch:`, err);
        });
      }
    },
  };

  return {
    state: {
      creds,
      keys,
    },
    saveCreds,
  };
}
